# XP Luna v1.3.17 — palette switching and tooltip contrast

- **Switching to dark now actually leaves the skin.** The host's layout
  presenter rewrites the page tokens from its own `theme/change` listener.
  Reacting inside that same synchronous emit let it re-apply the stale
  snapshot afterwards, so the beige layer stayed stuck in dark mode and
  switching back produced a bare white page. The palette reaction now runs
  after every listener (microtask), watches `data-ds-dark-theme`, and
  re-asserts the token layer once after boot.
- **Tooltips are readable again.** The bubble now pins both the XP pale-yellow
  background and the dark ink, so a dark host bubble can no longer meet our
  dark text. This covers the header's "change request" and the composer's
  "remove from session" hints.

Update, then fully quit and reopen the app — the client bundle is loaded at
boot, so a page refresh alone is not enough.

## 中文

- **切到深色时皮肤会真正退出。** 宿主的 layout presenter 会在自己的
  `theme/change` 监听里重写页面 token；如果我们在同一个同步事件里拆掉
  皮肤，它随后会把旧快照重新写回去，于是深色下仍然锁着米白，切回浅色
  又只剩纯白。现在调色板反应放到微任务里，等所有监听执行完再跑，并监听
  `data-ds-dark-theme`、启动后补一次 token 断言。
- **提示气泡恢复可读。** 气泡同时固定 XP 的淡黄底色和深色字，深色宿主
  气泡不会再和深色文字撞在一起。顶部“变更请求”、输入框“从本会话移除”
  的提示都包括在内。

更新后请完全退出并重新打开应用；client bundle 在启动时加载，只刷新页面不够。
