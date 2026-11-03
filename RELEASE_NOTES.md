# XP Luna v1.3.6 — compatibility fixes

Fixes for the official **DSH 0.2.1-rc.5** build, including its Windows desktop
window, while keeping the existing 0.2.2-alpha behaviour.

## Highlights

- **Brand badge restored**: the official wordmark paints its "Harness" badge
  with `currentColor` and inverts the letters. On the blue taskbar that became
  a white pill with white letters; the badge is dark again with white text,
  and inverted labels (the local build-version pill) use dark ink.
- **Opacity works on every page**: the glass is no longer limited to pages
  that carry a conversation/plugin/task marker (0.2.1-rc.5 ships some pages
  without them), so the opacity slider visibly changes the whole window.
- **Opacity works with OS transparency off**: the theme no longer falls back
  to an opaque window under `prefers-reduced-transparency`, which Windows
  Server and many desktops report by default.
- **Native Windows caption glyphs**: the desktop preload samples the native
  titlebar colours from the document; the minimize/maximize/close glyphs were
  black on the blue strip and are now white.

Settings, wallpaper import, the Host data directory and the plugin-market
sticky header are unchanged.

## Install

**Plugins → Add plugin** → `https://github.com/BH8GCJ/dsh-xp-luna`, or:

```sh
dsh plugin --profile desktop add github:BH8GCJ/dsh-xp-luna
```

Update an existing install from the Plugins page, or re-add the plugin. After
updating into a running desktop app, restart it once so the Host routes and
the new client bundle load.

## Licensing

The plugin code is MIT. No wallpaper is bundled, hosted or mirrored.
Microsoft wallpapers (including `Bliss.jpg` and the Microsoft Nostalgic
Windows Wallpaper 4K) are third-party copyrighted materials outside the MIT
scope. This is an independent community project, not affiliated with,
endorsed by, or sponsored by Microsoft. See
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## 中文

修复官方 **DSH 0.2.1-rc.5**（含 Windows 桌面窗口）下的显示问题，同时保持
0.2.2-alpha 的现有表现：

- 官方字标里的 “Harness” 徽章不再白底白字，恢复深色底、白字；本地构建的版本
  徽章也改为深色文字。
- 玻璃效果不再限定在带会话/插件/任务标记的页面，不透明度滑块在所有页面都能
  看到变化。
- 系统关闭“透明效果”（Windows Server 常见默认）时不再退回不透明窗口，滑块
  因此恢复作用。
- Windows 原生标题栏的最小化/最大化/关闭图标由黑色改为白色，与蓝色 Luna
  标题栏一致。

壁纸导入、Host 数据目录和插件市场吸顶栏保持不变。更新后请重启一次桌面应用，
让 Host 路由和新的客户端包生效。
