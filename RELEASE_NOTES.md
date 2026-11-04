# XP Luna v1.3.15 — settings page follows the DSH language

- The XP Luna settings section now reads the locale DSH is actually using
  (Settings → General → Language) instead of the browser/OS language. DSH in
  Chinese shows the Chinese page; any other DSH language shows English.
- The page subscribes to locale changes, so switching the language updates the
  settings copy immediately, without a reload.
- On hosts without the locale service it falls back to `<html lang>` and then
  English, so the theme still mounts.

Carried over:

- **Recommended chip** (1.3.14): white text on the XP blue chip in question cards.
- **Windows caption strip** (1.3.13): solid `#2A6FE0`, white glyphs, no seam.
- **HARNESS badge** (1.3.12): white pill with dark ink in both colour schemes.

Update, then fully quit and reopen the app — the client bundle is loaded at
boot, so a page refresh alone is not enough.

## 中文

- XP Luna 设置页现在跟随 **DSH 实际使用的语言**（设置 → 通用 → 语言），不再读
  浏览器/系统语言。DSH 是中文就显示中文，其他语言显示英文。
- 设置页订阅了语言切换事件，改语言后文案立即更新，不需要刷新。
- 如果宿主没有 locale 服务，则回退到 `<html lang>`，再回退到英文，插件仍可挂载。

一并包含：

- **“推荐”标签**（1.3.14）：问题卡片里改为 XP 蓝底白字。
- **Windows 标题栏**（1.3.13）：统一实色 `#2A6FE0`、白色图标、无接缝。
- **HARNESS 徽章**（1.3.12）：两种配色下都是白胶囊 + 深色字。

更新后请完全退出并重新打开应用；client bundle 在启动时加载，只刷新页面不够。
