/**
 * Assemble the client bundle.
 *
 * The Client module is a single script served to the browser. No wallpaper is
 * embedded: the picker imports a user-chosen image at runtime. Run after
 * editing src/client.js:
 *
 *   node scripts/build.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const source = readFileSync(new URL('src/client.js', root), 'utf8');

if (source.includes('__BLISS_DATA_URI__')) {
  throw new Error('src/client.js still references the old embedded-wallpaper placeholder');
}

// The stylesheet lives in a template literal: a stray backtick or `${` would
// close it early and turn CSS text into (possibly valid but wrong) JavaScript.
const cssStart = source.indexOf('const CSS = `');
const cssEnd = source.indexOf('`;', cssStart);
if (cssStart < 0 || cssEnd < 0) throw new Error('src/client.js has no `const CSS = ...` block');
const cssBody = source.slice(cssStart + 'const CSS = `'.length, cssEnd);
if (cssBody.includes('`')) throw new Error('CSS template contains a backtick; it would close the template literal');
if (cssBody.includes('${')) throw new Error('CSS template contains ${; escape it as \${ or use string concatenation');

writeFileSync(new URL('client.js', root), source);
console.log(`client.js written (${Math.round(source.length / 1024)} KiB, no bundled wallpaper)`);
