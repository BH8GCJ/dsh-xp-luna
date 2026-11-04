# XP Luna v1.3.16 — published on npm for the plugin market

- The package is now published as **`dsh-xp-luna`** (no longer the private
  `@local/dsh-xp-luna`), so the dsh-market catalog can resolve it from npm.
  Install it from **Plugins → Plugin Market → Themes**, or with
  `dsh plugin --profile desktop add dsh-xp-luna`.
- The bundle id and the Cordis patch name follow the same package name, so a
  market install and a local checkout behave identically.

Carried over:

- **Settings page follows the DSH language** (1.3.15): reads the active locale
  instead of the browser language and updates live when the language changes.
- **Recommended chip** (1.3.14): white text on the XP blue chip.
- **Windows caption strip** (1.3.13): solid `#2A6FE0`, white glyphs, no seam.
- **HARNESS badge** (1.3.12): white pill with dark ink in both schemes.

Update, then fully quit and reopen the app — the client bundle is loaded at
boot, so a page refresh alone is not enough.

## 中文

- 包名改为 **`dsh-xp-luna`** 并发布到 npm（不再是私有的 `@local/dsh-xp-luna`），
  这样插件市场的目录才能从 npm 解析到它。可在 **插件 → 插件市场 → 主题** 安装，
  或执行 `dsh plugin --profile desktop add dsh-xp-luna`。
- 客户端 bundle id 和 Cordis patch 名称同步改成同一个包名，市场安装和本地目录
  安装的表现一致。

一并包含：

- **设置页跟随 DSH 语言**（1.3.15）：读当前 locale，语言切换时实时更新。
- **“推荐”标签**（1.3.14）：XP 蓝底白字。
- **Windows 标题栏**（1.3.13）：统一实色 `#2A6FE0`、白色图标、无接缝。
- **HARNESS 徽章**（1.3.12）：两种配色下都是白胶囊 + 深色字。

更新后请完全退出并重新打开应用；client bundle 在启动时加载，只刷新页面不够。
