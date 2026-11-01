# XP Luna v1.3.3 — first release

A Windows XP Luna skin for **DeepSeek Harness**: a blue taskbar sidebar, a
Luna titlebar and a masked-glass window. Light mode only; dark mode keeps the
built-in palette.

## Highlights

- **Full Settings page** (Settings → XP Luna theme): wallpaper preview/import,
  window opacity shown as a percentage, window blur and desktop blur.
- **Host-stored wallpaper**: the original file is stored under
  `$DSH_HOME/.dsh-xp-luna-data/`, outside the repository; it survives app
  restarts and the Web UI's changing port. **No wallpaper is bundled.**
- **No automatic downloads**: the settings page links to Microsoft's official
  4K nostalgic wallpaper pack; the user downloads and imports it, or imports
  their own `Bliss.jpg` / JPG / PNG / WebP.
- **Masked glass**: the window paints a blurred copy of the wallpaper plus a
  separately composited tint, instead of `backdrop-filter`, so dragging the
  material sliders does not reload the image.
- **Separate blurs**: the desktop layer (`--xp-bg-blur`) and the window layer
  (`--xp-window-blur`) are independent.

## Install

**Plugins → Add plugin** → `https://github.com/BH8GCJ/dsh-xp-luna`, or:

```sh
dsh plugin --profile desktop add github:BH8GCJ/dsh-xp-luna
```

After installing into a running desktop app, restart it once so the Host
routes for the wallpaper/settings load.

## Licensing

The plugin code is MIT. No wallpaper is bundled, hosted or mirrored.
Microsoft wallpapers (including `Bliss.jpg` and the Microsoft Nostalgic
Windows Wallpaper 4K) are third-party copyrighted materials outside the MIT
scope. This is an independent community project, not affiliated with,
endorsed by, or sponsored by Microsoft. See
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## 中文

Windows XP Luna 风格的 DeepSeek Harness 浅色主题：蓝色任务栏侧栏、Luna
标题栏、遮罩玻璃窗口。设置页（设置 → XP Luna 主题）提供壁纸预览/导入、
百分比不透明度、窗口与桌面独立模糊；壁纸原图保存在本机 DSH 数据目录
（`$DSH_HOME/.dsh-xp-luna-data/`），不随仓库附带，也不会自动下载。代码以
MIT 发布；第三方壁纸不在许可范围内，详见
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
