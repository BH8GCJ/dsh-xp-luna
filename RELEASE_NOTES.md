# XP Luna v1.3.13 — Windows caption strip + HARNESS badge

Follow-up to 1.3.12: the native overlay is a solid rectangle and cannot carry
the Luna gradient, so a gradient under it left a visible vertical seam where
the overlay starts. On Windows the whole 40px strip now uses the same solid
`#2A6FE0` as the overlay; Linux keeps the gradient.

Fixes the two regressions reported on a clean Windows 11 install of the
official **DSH 0.2.1-rc.5** desktop build.

## Highlights

- **Native caption buttons on Windows 11**: the Desktop preload samples the
  titlebar colours from an invisible probe on `<body>`. Its `cssText` writes
  `visibility:hidden` without a space, so the old attribute selector never
  matched and the glyphs stayed dark. The probe is now matched on its actual
  signature, with white glyphs and a `#2A6FE0` strip forced on the element
  itself, and the Windows strip is painted with that same solid colour so the
  native overlay blends in without a seam.
- **HARNESS badge**: the official wordmark inverts the badge letters while the
  badge rectangle follows `currentColor`. The badge is now a white pill with
  dark ink in both colour schemes, matching the stock dark theme instead of
  flipping to a dark pill in light mode.
- Everything from 1.3.11 (glass on every page, tooltip ink, session menu,
  dark-desktop selects) is carried over.

## Install

Update from the Plugins page, or re-add the plugin. After updating a running
desktop app, **fully restart** it: the client bundle is loaded at boot, so a
page refresh alone keeps the previous bundle.

## Licensing

The plugin code is MIT. No wallpaper is bundled, hosted or mirrored.
Microsoft wallpapers (including `Bliss.jpg` and the Microsoft Nostalgic
Windows Wallpaper 4K) are third-party copyrighted materials outside the MIT
scope. This is an independent community project, not affiliated with,
endorsed by, or sponsored by Microsoft. See
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## 中文

修复全新安装的 Windows 11 上、官方 **DSH 0.2.1-rc.5** 桌面版出现的两个问题：

- **Windows 原生标题栏按钮**：Desktop 预载脚本用 `<body>` 上的隐藏探针取标题栏
  颜色。它的 `cssText` 写成 `visibility:hidden`（冒号后没有空格），旧选择器一直
  没命中，图标因此是深色。现在按真实的内联签名匹配，并在探针元素上强制白色
  图标和 `#2A6FE0` 底色；Windows 上的整条标题栏也用同一实色，原生覆盖层不再
  出现接缝。Linux 继续保留 Luna 渐变。
- **HARNESS 徽章**：官方字标把徽章字母做反色，而徽章矩形跟随 `currentColor`。
  现在两种配色下都固定为白色胶囊 + 深色字，和官方深色主题一致，不再在浅色
  模式下变成深色胶囊。

1.3.11 的修复（所有页面的玻璃效果、tooltip 文字、会话菜单、深色桌面下拉框）
全部保留。更新后请**完全退出并重新打开**桌面应用，只刷新页面不会加载新的
客户端包。
