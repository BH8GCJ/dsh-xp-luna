/**
 * Host half of the XP Luna bundle.
 *
 * The browser half must not keep the wallpaper in localStorage: the Web UI
 * origin changes port on every app launch, so a stored data URI would vanish
 * on restart. This half owns a small data directory under the DSH home
 * (outside the repository) and serves the wallpaper from a same-origin route.
 *
 * Routes (all relative to the running Web server):
 *
 *   GET/HEAD /dsh-xp-luna/wallpaper   the stored image (404 when none)
 *   POST     /dsh-xp-luna/wallpaper   upload the original image bytes
 *   DELETE   /dsh-xp-luna/wallpaper   remove the stored image
 *   GET      /dsh-xp-luna/settings    { alpha, blur, wallpaper }
 *   POST     /dsh-xp-luna/settings    save { alpha, blur }
 *
 * The image serve route is deliberately unfenced: an <img> request carries no
 * connection headers. Mutations go through `connection.requestRejection`.
 */
import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, open, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';

const DATA_DIR = '.dsh-xp-luna-data';
const SETTINGS_FILE = 'settings.json';
const WALLPAPER_FILE = 'wallpaper.img';
const UPLOAD_TMP = 'wallpaper.upload.tmp';
const ROUTE = '/dsh-xp-luna';
const MAX_UPLOAD = 25 * 1024 * 1024;
const MAX_SETTINGS_BODY = 64 * 1024;
const DEFAULT_SETTINGS = Object.freeze({ alpha: 0.75, blur: 4, backgroundBlur: 0 });

/** Resolve the DSH home without a package import, so a linked bundle works. */
function dshHome() {
  const fromEnv = process.env.DSH_HOME;
  if (typeof fromEnv === 'string' && fromEnv.length > 0) return fromEnv;
  return join(homedir(), '.dsh');
}

const dataDir = () => join(dshHome(), DATA_DIR);
const settingsPath = () => join(dataDir(), SETTINGS_FILE);
const wallpaperPath = () => join(dataDir(), WALLPAPER_FILE);

function clamp(value, min, max, fallback) {
  const number = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function normalizeSettings(raw) {
  const source = raw !== null && typeof raw === 'object' ? raw : {};
  const alpha = clamp(source.alpha, 0.5, 1, DEFAULT_SETTINGS.alpha);
  const blur = Math.round(clamp(source.blur, 0, 20, DEFAULT_SETTINGS.blur));
  const backgroundBlur = Math.round(clamp(source.backgroundBlur, 0, 20, DEFAULT_SETTINGS.backgroundBlur));
  return { alpha, blur, backgroundBlur };
}

async function readSettings() {
  try {
    return normalizeSettings(JSON.parse(await readFile(settingsPath(), 'utf8')));
  } catch (error) {
    return { ...DEFAULT_SETTINGS };
  }
}

async function writeSettings(settings) {
  await mkdir(dataDir(), { recursive: true });
  await writeFile(settingsPath(), JSON.stringify(settings), 'utf8');
}

async function hasWallpaper() {
  try {
    const info = await stat(wallpaperPath());
    return info.size > 0;
  } catch (error) {
    return false;
  }
}

async function readHead(path, length) {
  let handle;
  try {
    handle = await open(path, 'r');
    const buffer = Buffer.alloc(length);
    const { bytesRead } = await handle.read(buffer, 0, length, 0);
    return buffer.subarray(0, bytesRead);
  } catch (error) {
    return null;
  } finally {
    await handle?.close();
  }
}

function sniffImage(head) {
  if (head === null || head.length < 3) return undefined;
  if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return 'image/jpeg';
  if (
    head.length >= 8 &&
    head[0] === 0x89 &&
    head[1] === 0x50 &&
    head[2] === 0x4e &&
    head[3] === 0x47 &&
    head[4] === 0x0d &&
    head[5] === 0x0a &&
    head[6] === 0x1a &&
    head[7] === 0x0a
  ) {
    return 'image/png';
  }
  if (head.length >= 12 && head.toString('ascii', 0, 4) === 'RIFF' && head.toString('ascii', 8, 12) === 'WEBP') {
    return 'image/webp';
  }
  return undefined;
}

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}

async function serveWallpaper(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    sendJson(res, 405, { ok: false, error: 'expected GET or HEAD' });
    return;
  }
  try {
    const info = await stat(wallpaperPath());
    if (info.size === 0) throw new Error('empty');
    const head = await readHead(wallpaperPath(), 16);
    const mime = sniffImage(head);
    if (mime === undefined) throw new Error('not an image');
    res.writeHead(200, {
      'Content-Type': mime,
      'Content-Length': info.size,
      'Cache-Control': 'no-store',
    });
    if (req.method === 'HEAD') {
      res.end();
      return;
    }
    createReadStream(wallpaperPath()).pipe(res);
  } catch (error) {
    res.writeHead(404, { 'Cache-Control': 'no-store' });
    res.end('no wallpaper');
  }
}

async function uploadWallpaper(req, res) {
  const declared = String(req.headers['content-type'] ?? '').split(';')[0].trim().toLowerCase();
  if (!declared.startsWith('image/')) {
    req.resume();
    sendJson(res, 415, { ok: false, error: 'expected an image' });
    return;
  }
  try {
    await mkdir(dataDir(), { recursive: true });
    const tmp = join(dataDir(), UPLOAD_TMP);
    await rm(tmp, { force: true });
    const out = createWriteStream(tmp);
    const state = { failed: false };
    const fail = () => {
      if (state.failed) return;
      state.failed = true;
      out.destroy();
      rm(tmp, { force: true }).catch(() => {});
    };
    const tooLarge = () => {
      if (state.failed) return;
      req.destroy();
      out.destroy();
      rm(tmp, { force: true }).catch(() => {});
      try {
        sendJson(res, 413, { ok: false, error: 'too large' });
      } catch (error) {
        // response already closed
      }
    };
    req.on('aborted', fail);
    req.on('error', fail);
    out.on('error', fail);
    let received = 0;
    req.on('data', (chunk) => {
      received += chunk.length;
      if (received > MAX_UPLOAD) tooLarge();
    });
    req.pipe(out);
    out.on('finish', async () => {
      if (state.failed) return;
      try {
        if (received === 0) {
          await rm(tmp, { force: true });
          sendJson(res, 400, { ok: false, error: 'empty upload' });
          return;
        }
        const mime = sniffImage(await readHead(tmp, 16));
        if (mime === undefined) {
          await rm(tmp, { force: true });
          sendJson(res, 415, { ok: false, error: 'not a supported image' });
          return;
        }
        await rm(wallpaperPath(), { force: true });
        await rename(tmp, wallpaperPath());
        sendJson(res, 200, { ok: true, wallpaper: true });
      } catch (error) {
        await rm(tmp, { force: true }).catch(() => {});
        sendJson(res, 500, { ok: false, error: 'could not store the image' });
      }
    });
  } catch (error) {
    console.error('xp-luna: wallpaper upload failed', error);
    sendJson(res, 500, { ok: false, error: 'could not store the image' });
  }
}

async function removeWallpaper(req, res) {
  await rm(wallpaperPath(), { force: true });
  sendJson(res, 200, { ok: true, wallpaper: false });
}

async function saveSettings(req, res) {
  const chunks = [];
  let received = 0;
  for await (const chunk of req) {
    received += chunk.length;
    if (received > MAX_SETTINGS_BODY) {
      req.destroy();
      sendJson(res, 413, { ok: false, error: 'too large' });
      return;
    }
    chunks.push(chunk);
  }
  let raw;
  try {
    raw = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
  } catch (error) {
    sendJson(res, 400, { ok: false, error: 'invalid json' });
    return;
  }
  const settings = normalizeSettings(raw);
  await writeSettings(settings);
  sendJson(res, 200, { ok: true, ...settings, wallpaper: await hasWallpaper() });
}

export function apply(ctx) {
  ctx.inject(['connection', 'webServer'], (webCtx) => {
    const fence = async (req, res, run) => {
      let rejection;
      try {
        rejection = webCtx.connection.requestRejection(req);
      } catch (error) {
        rejection = 403;
      }
      if (rejection !== undefined) {
        res.writeHead(rejection);
        res.end(rejection === 401 ? 'unauthorized' : 'forbidden');
        return;
      }
      await run();
    };

    const handler = async (req, res) => {
      const pathname = new URL(req.url ?? '/', 'http://dsh.internal').pathname;
      const method = req.method ?? 'GET';
      try {
        if (pathname === `${ROUTE}/wallpaper`) {
          if (method === 'GET' || method === 'HEAD') return await serveWallpaper(req, res);
          if (method === 'POST') return await fence(req, res, () => uploadWallpaper(req, res));
          if (method === 'DELETE') return await fence(req, res, () => removeWallpaper(req, res));
          sendJson(res, 405, { ok: false, error: 'method not allowed' });
          return;
        }
        if (pathname === `${ROUTE}/settings`) {
          if (method === 'GET') {
            const settings = await readSettings();
            sendJson(res, 200, { ...settings, wallpaper: await hasWallpaper() });
            return;
          }
          if (method === 'POST') return await fence(req, res, () => saveSettings(req, res));
          sendJson(res, 405, { ok: false, error: 'method not allowed' });
          return;
        }
        res.writeHead(404);
        res.end();
      } catch (error) {
        console.error('xp-luna: request failed', error);
        if (!res.headersSent) sendJson(res, 500, { ok: false, error: 'request failed' });
        else res.end();
      }
    };

    webCtx.effect(
      () => webCtx.webServer.register({ kind: 'prefix', path: ROUTE, handler }),
      'xp-luna: wallpaper and settings routes',
    );
  });
}
