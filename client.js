/**
 * Client half of the XP Luna skin.
 *
 * Everything lives inside `factory()`. A Client bundle is evaluated more than
 * once in the same document (boot prefetch plus one execution per HMR rev), so
 * a top-level `const` would throw "Identifier has already been declared" on the
 * second run. Declarations inside the factory are ordinary function scope and
 * stay re-executable.
 *
 * Three parts, all installed only while the resolved scheme is light:
 *
 * 1. Alias tokens (`ctx.theme.overrideTokens`) — the palette, corners, shadows,
 *    scrollbar. Written as inline custom properties on `body`, so a value may be
 *    anything the consuming property accepts, but tokens read inside
 *    `color-mix()` or as a border colour must stay plain colours.
 * 2. A plugin-owned stylesheet — the parts a token cannot express: the desktop
 *    surface behind the shell, the blue taskbar column, and the framed window
 *    with its Luna titlebar.
 * 3. A local wallpaper picker — the only DOM the plugin injects. It reads a
 *    user-imported image from localStorage and applies it through the
 *    `--xp-wallpaper` custom property. No wallpaper ships with the plugin and
 *    nothing is fetched.
 *
 * The stylesheet anchors only on stable host attributes, never on hashed
 * CSS-module class names:
 *
 *   [data-shell-overlay]            the frame; its element children are
 *                                   sidebar, centre, rightbar, bottom row,
 *                                   overlay, leading seat
 *   [data-windows-titlebar]         Desktop caption mode (Linux and Windows)
 *   [data-conversation-header-corner]  the header's far-right seat
 *   [data-sidebar-right-expand]     the right-panel expand control
 *   [data-schedule-reminder-entry]  the schedule trigger in the utility row
 *   [data-open-target]              the open-in-app split control
 *
 * The client file is copied to client.js by scripts/build.mjs.
 */
window.__ModuleLoader__.load({
  id: '@local/dsh-xp-luna',
  factory() {
    /** Luna palette (identical values for both modes; the layer only runs in light). */
    const LUNA = {
      // ---- surfaces ---------------------------------------------------------
      '--dsw-alias-bg-base': '#ECE9D8',
      '--dsw-alias-bg-layer-1': '#FFFFFF',
      '--dsw-alias-bg-layer-2': '#F7F5EC',
      '--dsw-alias-bg-layer-3': '#E8E4D4',
      '--dsw-alias-bg-overlay': '#ECE9D8',
      '--dsw-alias-bg-module-platform': '#DCD8C8',
      '--dsw-alias-bg-multi-select': '#E8E4D4',
      '--dsw-alias-bg-skeleton': 'rgba(0, 0, 0, 0.06)',
      '--dsw-alias-bg-document-preview': '#F7F5EC',
      '--dsw-alias-bg-document-selection': 'rgba(49, 106, 197, 0.35)',
      '--dsw-alias-label-document-preview': '#3B3B33',
      '--dsw-alias-bg-mask-1': 'rgba(0, 0, 0, 0.30)',
      '--dsw-alias-bg-mask-2': 'rgba(0, 0, 0, 0.15)',
      '--dsw-alias-bg-mask-3': 'rgba(0, 0, 0, 0.48)',
      '--dsw-alias-bg-mask-photo': 'rgba(0, 0, 0, 0.88)',
      '--dsw-alias-bg-mask-drop': 'rgba(255, 255, 255, 0.70)',

      // ---- borders ----------------------------------------------------------
      '--dsw-alias-border-inverted': '#FFFFFF',
      '--dsw-alias-border-inverted2': 'rgba(255, 255, 255, 0)',
      '--dsw-alias-border-l1': '#DCD8C8',
      '--dsw-alias-border-l2': '#C9C5B4',
      '--dsw-alias-border-l2-darkmode-thin': '#C9C5B4',
      '--dsw-alias-border-l3': '#ACA899',
      '--dsw-alias-border-l4': '#8A8678',

      // ---- brand ------------------------------------------------------------
      '--dsw-alias-brand-primary': '#0054E3',
      '--dsw-alias-brand-primary-invert': '#FFFFFF',
      '--dsw-alias-brand-primary-new-colorprimary-new-color': '#0054E3',
      '--dsw-alias-brand-text': '#003399',
      '--dsw-alias-link': '#0054E3',

      // ---- text -------------------------------------------------------------
      '--dsw-alias-label-primary': '#000000',
      '--dsw-alias-label-primary-dimmed': '#1F1F1A',
      '--dsw-alias-label-primary-foreground': '#FFFFFF',
      '--dsw-alias-label-primary-inverted': '#FFFFFF',
      '--dsw-alias-label-primary-bluish': '#003399',
      '--dsw-alias-label-secondary': '#3B3B33',
      '--dsw-alias-label-tertiary': '#5B5B52',
      '--dsw-alias-label-caption': '#6E6C60',
      '--dsw-alias-label-dimmed': '#C7C4B5',
      '--dsw-alias-label-shimmer': 'color-mix(in srgb, #000000 30%, transparent)',
      '--dsw-alias-label-deep-diving': '#1F4E9C',
      '--dsw-alias-label-deep-diving-shimmer': '#4A7FD0',
      '--dsw-alias-menu-icon': '#2B2B25',

      // ---- buttons ----------------------------------------------------------
      '--dsw-alias-button-contrast-fill': '#3B3B33',
      '--dsw-alias-button-elevated-fill': '#FFFFFF',
      '--dsw-alias-button-floating-fill': '#FFFFFF',
      '--dsw-alias-button-floating-hover': '#F1EFE2',
      '--dsw-alias-button-ghost-active-border': '#8A8678',
      '--dsw-alias-button-ghost-active-fill': '#E8E4D4',
      '--dsw-alias-button-ghost-active-hover': '#DCD8C8',
      '--dsw-alias-button-info-fill': '#0054E3',
      '--dsw-alias-button-info-hover': '#1A6AE8',
      '--dsw-alias-button-primary-dimmed': '#E8E4D4',
      '--dsw-alias-button-primary-fill': '#0054E3',
      '--dsw-alias-button-primary-hover': '#003DB3',

      // ---- interaction ------------------------------------------------------
      '--dsw-alias-interactive-bg-hover': 'rgba(49, 106, 197, 0.10)',
      '--dsw-alias-interactive-bg-hover-solid': '#E8E4D4',
      '--dsw-alias-interactive-bg-hover-accent': 'rgba(49, 106, 197, 0.16)',
      '--dsw-alias-interactive-bg-hover-danger': 'rgba(204, 0, 0, 0.08)',
      '--dsw-alias-interactive-bg-active': 'rgba(49, 106, 197, 0.22)',

      // ---- states -----------------------------------------------------------
      '--dsw-alias-state-business-primary': '#316AC5',
      '--dsw-alias-state-business-tertiary': '#C6D3EF',
      '--dsw-alias-state-success-primary': '#2E8B22',
      '--dsw-alias-state-success-secondary': '#4FB31B',
      '--dsw-alias-state-success-tertiary': '#DFF0D0',
      '--dsw-alias-state-warn-primary': '#C07A00',
      '--dsw-alias-state-warn-secondary': '#E8A33D',
      '--dsw-alias-state-warn-tertiary': '#FDF1D6',
      '--dsw-alias-state-warn-label': '#8A5A00',
      '--dsw-alias-state-error-primary': '#CC0000',
      '--dsw-alias-state-error-secondary': '#E05252',
      '--dsw-alias-state-idle-primary': '#ACA899',
      '--dsw-alias-state-done-primary': '#7A4BB8',

      // ---- markdown / code --------------------------------------------------
      '--dsw-alias-markdown-citation': '#F1EFE2',
      '--dsw-alias-markdown-code-block': '#FFFFFF',
      '--dsw-alias-markdown-code-block-banner': '#EDEADE',
      '--dsw-alias-markdown-code-segment-selected': '#FFFFFF',
      '--dsw-alias-markdown-code-segment-unselected': '#E8E4D4',
      '--dsw-alias-markdown-inline-code': '#F5F3EA',
      '--dsw-alias-markdown-placeholder': '#F1EFE2',
      '--dsw-alias-markdown-tag': '#E3DFCF',
      '--dsw-alias-code-diff-added': 'rgba(46, 139, 34, 0.10)',
      '--dsw-alias-code-diff-deleted': 'rgba(204, 0, 0, 0.10)',
      '--dsw-alias-file-diff-added-bg': '#E6F4E7',
      '--dsw-alias-file-diff-added-gutter': '#EDF7ED',
      '--dsw-alias-file-diff-added-marker': '#01A241',
      '--dsw-alias-file-diff-deleted-bg': '#FCE6E2',
      '--dsw-alias-file-diff-deleted-gutter': '#FDECE9',
      '--dsw-alias-file-diff-deleted-marker': '#BA2723',

      // ---- scrollbar --------------------------------------------------------
      '--dsw-alias-scrollbar-bg-l1': '#C9C5B4',
      '--dsw-alias-scrollbar-bg-l2': '#C9C5B4',
      '--dsw-alias-scrollbar-hover-l1': '#A9A496',
      '--dsw-alias-scrollbar-hover-l2': '#8A8678',
      '--dsh-scrollbar-width': '14px',
      '--dsh-scrollbar-thumb-border': '3px',
      '--dsh-scrollbar-track-margin': '0px',

      // ---- region-specific --------------------------------------------------
      '--dsw-specific-bubble': '#FFFFFF',
      '--dsw-specific-bubble-highlight': '#E8F0FE',
      '--dsw-specific-input-major': '#FFFFFF',
      '--dsw-specific-login-input': '#F7F5EC',
      '--dsw-specific-selector': '#E8E4D4',
      '--dsw-specific-sidebar-fill': '#2A6FE0',
      '--dsw-specific-sidebar-nav-item-active': '#C6D3EF',
      '--dsw-specific-sidebar-nav-item-active-accent': '#316AC5',
      '--dsw-specific-tip': '#FFFFE1',
      '--dsw-menu-surface-fill': '#FFFFFF',
      '--dsw-alias-menu-group-header-fill': '#EDEADE',
      '--dsw-specific-menu': '#FFFFFF',
      '--dsw-alias-tooltip-bg': '#FFFFE1',
      '--dsw-alias-tooltip-key-bg': '#F0EBB8',
      '--dsw-alias-toast-bg': '#316AC5',
      '--dsw-alias-toast-label': '#FFFFFF',
      '--dsw-alias-turn-trigger-bg': '#F1EFE2',
      '--dsw-alias-turn-trigger-bg-hover': '#E8E4D4',
      '--dsw-alias-switch-thumb': '#FFFFFF',

      // ---- illustration, settings, onboarding ------------------------------
      '--dsw-alias-illustration-background': '#F7F5EC',
      '--dsw-alias-illustration-backing': '#DCD8C8',
      '--dsw-alias-illustration-detail': '#ACA899',
      '--dsw-alias-illustration-surface': '#FFFFFF',
      '--dsw-alias-illustration-inset': '#F1EFE2',
      '--dsw-alias-illustration-shadow': '#DCD8C8',
      '--dsw-alias-settings-card-fill': '#FFFFFF',
      '--dsw-alias-settings-card-stroke': '#ACA899',
      '--dsw-alias-onboarding-accent': '#0054E3',
      '--dsw-alias-onboarding-card-fill': '#FFFFFF',
      '--dsw-alias-onboarding-checkbox-border': '#8A8678',
      '--dsw-alias-onboarding-secondary-fill': '#E8E4D4',

      // ---- geometry and material -------------------------------------------
      '--dsw-radius-xs': '2px',
      '--dsw-radius-sm': '3px',
      '--dsw-radius-md': '4px',
      '--dsw-radius-lg': '6px',
      '--dsw-radius-xl': '8px',
      '--dsw-radius-panel': '8px',
      // XP corners are circular, not the superellipse the base sheet prefers.
      '--dsw-corner-shape': 'round',
      '--dsw-focus-ring-color': '#316AC5',
      '--dsw-shadow-lv1': '0 1px 2px rgba(0, 0, 0, 0.14)',
      '--dsw-shadow-lv1-blur': '0 2px 6px rgba(0, 0, 0, 0.10)',
      '--dsw-shadow-lv2': '0 2px 5px rgba(0, 0, 0, 0.18), 0 1px 2px rgba(0, 0, 0, 0.12)',
      '--dsw-shadow-lv3': '0 0 0 1px #ACA899, 0 6px 16px rgba(0, 0, 0, 0.22)',
      // XP menus and dialogs are opaque: no frosted glass, no backdrop blur.
      '--dsw-menu-backdrop-filter': 'none',
      '--dsw-mask-blur': 'none',
      '--dsw-linear-gradient-think': 'linear-gradient(180deg, #FFFFFF 20.19%, rgba(255, 255, 255, 0) 100%)',
      '--dsw-linear-think-select': 'linear-gradient(180deg, #F1EFE2 20.19%, rgba(241, 239, 226, 0) 100%)',
    };

    /** `overrideTokens` requires an explicit value per colour scheme. */
    const TOKENS = Object.fromEntries(
      Object.entries(LUNA).map(([name, value]) => [name, { light: value, dark: value }]),
    );

    /**
     * Structure the token layer cannot reach: the desktop behind the shell, the
     * taskbar column, and the framed window with its Luna titlebar.
     *
     * The frame's element children: sidebar (1), centre (2), rightbar (3),
     * bottom row (4), overlay layer (5), leading seat (6). `DocumentTitle` and
     * the React fragment render no element, so the indices stay stable.
     */
    const CSS = `
/* Window material. --xp-window-alpha is the beige's opacity, --xp-window-blur
   softens the wallpaper behind it. Current: 0.75 / 4px (light glass, photo
   shapes readable through it). More solid: 0.85 / 18px. Heavier glass:
   0.65 / 8px; below 0.6 the text contrast starts to suffer. */
html {
  --xp-window-alpha: 0.75;
  --xp-window-blur: 4px;
}

/* The desktop: html paints the canvas, body repeats it so the shell CSS that
   sets a body background cannot hide it either. No wallpaper ships with the
   plugin: --xp-wallpaper is set from localStorage by the wallpaper picker,
   and the gradient below is the fallback until the user imports an image. */
html, body {
  background-color: #245EDC;
  background-image: var(--xp-wallpaper, linear-gradient(180deg, #4A9BF7 0%, #9CC4F2 48%, #A9C87E 52%, #6E9C46 100%));
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

/* The shell paint stops at the frame so the desktop shows around the window.
   The second selector outranks [data-windows-titlebar] .frame, which the
   Desktop shell adds on Linux and Windows and which would otherwise paint the
   whole frame with the sidebar fill token. */
div:has(> [data-shell-overlay]) { background: transparent; }
html[data-windows-titlebar] div:has(> [data-shell-overlay]) { background: transparent; }

/* ---- taskbar: the sidebar column --------------------------------------- */
div:has(> [data-shell-overlay]) > div:first-child {
  background: linear-gradient(180deg, #4A9BF7 0%, #2A6FE0 46%, #1747A8 100%);
  border-right: 1px solid #10347C;
  box-shadow:
    inset 1px 0 0 rgba(255, 255, 255, 0.45),
    inset -1px 0 0 rgba(255, 255, 255, 0.12),
    3px 0 14px rgba(0, 0, 0, 0.30);

  --dsw-specific-sidebar-fill: transparent;
  --dsw-alias-label-primary: #FFFFFF;
  --dsw-alias-label-primary-dimmed: #FFFFFF;
  --dsw-alias-label-secondary: rgba(255, 255, 255, 0.88);
  --dsw-alias-label-tertiary: rgba(255, 255, 255, 0.78);
  --dsw-alias-label-caption: rgba(255, 255, 255, 0.66);
  --dsw-alias-label-dimmed: rgba(255, 255, 255, 0.45);
  --dsw-alias-brand-text: #FFFFFF;
  --dsw-alias-menu-icon: #FFFFFF;
  --dsw-alias-link: #FFFFFF;
  --dsw-alias-border-l1: rgba(255, 255, 255, 0.16);
  --dsw-alias-border-l2: rgba(255, 255, 255, 0.22);
  --dsw-alias-border-l3: rgba(255, 255, 255, 0.28);
  --dsw-alias-border-l4: rgba(255, 255, 255, 0.38);
  --dsw-alias-interactive-bg-hover: rgba(255, 255, 255, 0.16);
  --dsw-alias-interactive-bg-active: rgba(255, 255, 255, 0.26);
  --dsw-alias-interactive-bg-hover-solid: rgba(255, 255, 255, 0.16);
  --dsw-alias-interactive-bg-hover-accent: rgba(255, 255, 255, 0.22);
  --dsw-alias-bg-layer-1: rgba(9, 38, 92, 0.55);
  --dsw-alias-bg-layer-2: rgba(9, 38, 92, 0.68);
  --dsw-alias-bg-layer-3: rgba(9, 38, 92, 0.45);
  --dsw-alias-bg-overlay: #1747A8;
  --dsw-alias-bg-module-platform: rgba(255, 255, 255, 0.14);
  --dsw-alias-bg-multi-select: rgba(255, 255, 255, 0.18);
  --dsw-alias-bg-skeleton: rgba(255, 255, 255, 0.18);
  --dsw-specific-input-major: rgba(6, 30, 76, 0.42);
  --dsw-specific-selector: rgba(255, 255, 255, 0.16);
  --dsw-specific-tip: rgba(255, 255, 255, 0.14);
  --dsw-specific-sidebar-nav-item-active: rgba(255, 255, 255, 0.24);
  --dsw-specific-sidebar-nav-item-active-accent: #FFFFFF;
  --dsw-alias-settings-card-fill: rgba(255, 255, 255, 0.10);
  --dsw-alias-settings-card-stroke: rgba(255, 255, 255, 0.28);
  --dsw-alias-button-elevated-fill: rgba(255, 255, 255, 0.18);
  --dsw-alias-button-floating-fill: #1747A8;
  --dsw-alias-button-floating-hover: #2A6FE0;
  --dsw-alias-button-ghost-active-fill: rgba(255, 255, 255, 0.22);
  --dsw-alias-button-ghost-active-hover: rgba(255, 255, 255, 0.30);
  --dsw-alias-state-business-primary: #FFFFFF;
  --dsw-alias-focus-ring-color: #FFFFFF;
}

/* ---- window: the centre column ----------------------------------------- */
div:has(> [data-shell-overlay]) > div:nth-child(2) {
  /* The host derives the transcript width as clamp(680, column * 0.64, 920),
     so the window must reach ~1440px for the text column to hit its own
     920px ceiling. The percentage keeps a strip of desktop on smaller screens. */
  max-width: min(1440px, 92%);
  width: 100%;
  justify-self: center;
  margin: 14px 0;
  background: #ECE9D8;
  border-radius: 8px;
  overflow: hidden;
  box-shadow:
    inset 0 0 0 1px #8A8678,
    inset 0 0 0 2px rgba(255, 255, 255, 0.55),
    0 14px 34px rgba(0, 0, 0, 0.38);
}

/* Glass for the conversation, the Plugins page and the automation tasks
   page. Other management pages (Settings, ...) keep the opaque work surface
   so their lists stay readable. */
div:has(> [data-shell-overlay]) > div:nth-child(2):has([data-conversation-content], [data-plugin-bar], [data-testid="task-manager-page"]) {
  background: rgba(236, 233, 216, var(--xp-window-alpha));
  -webkit-backdrop-filter: blur(var(--xp-window-blur)) saturate(1.04);
  backdrop-filter: blur(var(--xp-window-blur)) saturate(1.04);
}

/* The plugin page sits on the same glass, but its long forms and toolbars
   make the wallpaper's cloud bank read as a warm band around the search row.
   Give this page a calmer glass: a little more beige, a little more blur. */
div:has(> [data-shell-overlay]) > div:nth-child(2):has([data-plugin-bar]) {
  background: rgba(236, 233, 216, 0.9);
  -webkit-backdrop-filter: blur(8px) saturate(1.02);
  backdrop-filter: blur(8px) saturate(1.02);
}

/* Respect the OS reduced-transparency preference: keep the layout but fall
   back to an opaque window instead of the glass. */
@media (prefers-reduced-transparency: reduce) {
  div:has(> [data-shell-overlay]) > div:nth-child(2):has([data-conversation-content], [data-plugin-bar], [data-testid="task-manager-page"]) {
    background: #ECE9D8;
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }
}

/* ---- Plugins page: the same Luna titlebar over the glass ------------- */
/* The page bar paints the full-width band; the page's own header sits on it,
   so its title, intro and tab labels invert to white over the blue. The
   toolbar buttons keep their own light/dark surfaces, which stay readable. */
div[data-plugin-bar][data-natural]::before {
  background: linear-gradient(180deg, #4A9BF7 0%, #2A6FE0 44%, #1747A8 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.55),
    inset 0 -1px 0 rgba(0, 0, 0, 0.35);
}
[data-plugin-bar] [data-plugin-header-part="title"] {
  color: #FFFFFF;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.35);
}
[data-plugin-bar] [data-plugin-header-part="intro"] {
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
}
[data-plugin-bar] [data-plugin-header-part="intro"] button {
  color: rgba(255, 255, 255, 0.85);
}
/* The host's segmented control paints a beige track, which reads like a
   piece of the body floating on the blue. Turn it into plain titlebar tabs:
   transparent track, white labels, active underline. */
[data-plugin-bar] [data-plugin-header-part="tabs"] [role="tablist"] {
  display: flex;
  gap: 18px;
  width: fit-content;
  min-width: 0;
  padding: 0;
  background: transparent;
  border: 0;
  box-shadow: none;
}
[data-plugin-bar] [data-plugin-header-part="tabs"] [role="tablist"] > [aria-hidden="true"] {
  display: none;
}
[data-plugin-bar] [data-plugin-header-part="tabs"] [role="tab"] {
  padding: 4px 0 6px;
  border-bottom: 2px solid transparent;
  border-radius: 0;
  background: transparent;
  color: rgba(255, 255, 255, 0.78);
  font-weight: 500;
}
[data-plugin-bar] [data-plugin-header-part="tabs"] [role="tab"]:hover {
  background: transparent;
  color: #FFFFFF;
}
[data-plugin-bar] [data-plugin-header-part="tabs"] [role="tab"][aria-selected="true"],
[data-plugin-bar] [data-plugin-header-part="tabs"] [role="tab"][aria-selected="true"]:hover {
  color: #FFFFFF;
  border-bottom-color: #FFFFFF;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
}

/* ---- automation tasks page: a scrolling Luna band --------------------- */
/* The page paints its own beige surface, so without this rule the window
   glass never shows. Its heading is content (it scrolls), so the titlebar is
   a background on the scroll container, painted local: it travels with the
   heading instead of sticking. Band height = heading padding-top + the
   button row (28 + 32). */
section[data-testid="task-manager-page"] {
  background: transparent;
}
section[data-testid="task-manager-page"] > div:first-child > div:first-child {
  background-image: linear-gradient(180deg, #4A9BF7 0%, #2A6FE0 44%, #1747A8 calc(100% - 1px), #10347C 100%);
  background-repeat: no-repeat;
  background-size: 100% 60px;
  background-attachment: local;
}
section[data-testid="task-manager-page"] div:has(> h1) > h1 {
  color: #FFFFFF;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.35);
}

/* ---- XP command buttons: the tasks and Plugins toolbars --------------- */
/* Both pages put these buttons on the blue band; the flat host fills are
   replaced with the Luna 3D surface (light bevel, dark text). The Plugins
   add control is a split button, so its halves share one border. */
section[data-testid="task-manager-page"] div:has(> h1) button,
[data-plugin-bar] [data-plugin-header-part="toolbar"] button,
[data-dsh-market-plugins-tab="true"] div:has(> h2) + div button,
[data-dsh-market-plugins-tab="true"] button[aria-expanded],
[data-dsh-market-plugins-tab="true"] button[aria-haspopup="menu"] {
  box-sizing: border-box;
  border: 1px solid #003C74;
  border-radius: 3px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0.10) 46%, rgba(255, 255, 255, 0) 47%),
    linear-gradient(180deg, #FFFFFF 0%, #F2F0E7 48%, #DCD8C7 100%);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.75),
    inset 0 -1px 0 rgba(0, 0, 0, 0.10),
    0 1px 2px rgba(0, 0, 0, 0.22);
  color: #1F1F1A;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.85);
}
section[data-testid="task-manager-page"] div:has(> h1) button:hover,
[data-plugin-bar] [data-plugin-header-part="toolbar"] button:hover,
[data-dsh-market-plugins-tab="true"] div:has(> h2) + div button:hover,
[data-dsh-market-plugins-tab="true"] button[aria-expanded]:hover,
[data-dsh-market-plugins-tab="true"] button[aria-haspopup="menu"]:hover {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.16) 46%, rgba(255, 255, 255, 0) 47%),
    linear-gradient(180deg, #FFFFFF 0%, #FBF9F2 48%, #E7E3D5 100%);
}
section[data-testid="task-manager-page"] div:has(> h1) button:active,
[data-plugin-bar] [data-plugin-header-part="toolbar"] button:active,
[data-dsh-market-plugins-tab="true"] div:has(> h2) + div button:active,
[data-dsh-market-plugins-tab="true"] button[aria-expanded]:active,
[data-dsh-market-plugins-tab="true"] button[aria-haspopup="menu"]:active {
  background: linear-gradient(180deg, #E2DECF 0%, #EFEBDD 100%);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.25);
}
section[data-testid="task-manager-page"] div:has(> h1) button:disabled,
[data-plugin-bar] [data-plugin-header-part="toolbar"] button:disabled,
[data-dsh-market-plugins-tab="true"] div:has(> h2) + div button:disabled,
[data-dsh-market-plugins-tab="true"] button[aria-expanded]:disabled,
[data-dsh-market-plugins-tab="true"] button[aria-haspopup="menu"]:disabled {
  background: linear-gradient(180deg, #F4F2EA 0%, #E6E2D5 100%);
  color: rgba(31, 31, 26, 0.45);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.5);
}
[data-plugin-bar] [data-plugin-header-part="toolbar"] span[role="group"] {
  border: 1px solid #003C74;
  border-radius: 3px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0.10) 46%, rgba(255, 255, 255, 0) 47%),
    linear-gradient(180deg, #FFFFFF 0%, #F2F0E7 48%, #DCD8C7 100%);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.75),
    inset 0 -1px 0 rgba(0, 0, 0, 0.10),
    0 1px 2px rgba(0, 0, 0, 0.22);
  overflow: hidden;
}
[data-plugin-bar] [data-plugin-header-part="toolbar"] span[role="group"] button {
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  color: #1F1F1A;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.85);
}
[data-plugin-bar] [data-plugin-header-part="toolbar"] span[role="group"] button:hover {
  background: rgba(255, 255, 255, 0.55);
}
[data-plugin-bar] [data-plugin-header-part="toolbar"] span[role="group"] button:active {
  background: rgba(0, 0, 0, 0.08);
}
[data-plugin-bar] [data-plugin-header-part="toolbar"] span[role="group"] button + button {
  border-left: 1px solid #7F9DB9;
}

/* ---- plugin market: clear the sticky search band --------------------- */
/* The market's sticky search header paints the opaque beige work surface,
   which reads as a warm band around the search field on the glass page. Let
   the glass through; the blur keeps the row legible when results scroll
   underneath it. */
[data-dsh-market-plugins-tab="true"] [class*="_stickyHead"] {
  background: transparent !important;
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}

/* ---- desktop caption: the native 40px drag strip ----------------------- */
/* The Desktop shell reserves this band on Linux and Windows; paint it with
   the same Luna gradient as the conversation header instead of a flat fill. */
html[data-windows-titlebar] div:has(> [data-shell-overlay])::before {
  background: linear-gradient(180deg, #4A9BF7 0%, #2A6FE0 46%, #1747A8 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.55),
    inset 0 -1px 0 rgba(0, 0, 0, 0.35);
}

/* The Desktop shell mounts its caption menu (Application / Edit) into that
   band from a shadow root, so only the inherited variables can reach it. */
[data-windows-menu] {
  --dsw-alias-label-primary: #FFFFFF;
  --dsw-alias-label-secondary: rgba(255, 255, 255, 0.92);
  --dsw-alias-interactive-bg-hover: rgba(255, 255, 255, 0.24);
  --dsw-alias-state-business-primary: #FFFFFF;
}

/* The conversation canvas repaints the base colour itself. Clear only that
   surface so the glass shows once; sticky covers (composer shelf, compaction
   and disclosure headers) keep the opaque token so content cannot bleed
   through them while scrolling. */
div:has(> [data-shell-overlay]) > div:nth-child(2) div[data-phase] {
  background-color: transparent;
}

/* ---- titlebar: the conversation header --------------------------------- */
/* Scoped to the conversation root: other main panels keep the host's own
   header, so their controls are not painted white-on-blue. */
div:has(> [data-shell-overlay]) > div:nth-child(2) div[data-phase] header[data-window-drag] {
  background-image:
    linear-gradient(180deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.10) 45%, rgba(255, 255, 255, 0) 56%),
    linear-gradient(180deg, #4A9BF7 0%, #2A6FE0 44%, #1747A8 100%);
  background-color: #2A6FE0;
  border-bottom: 1px solid #10347C;
  box-shadow: inset 0 -1px 0 rgba(255, 255, 255, 0.18);
  /* Inherited by the title text; keeps it readable on the gradient. */
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.35);

  --dsw-alias-label-primary: #FFFFFF;
  --dsw-alias-label-primary-dimmed: #FFFFFF;
  --dsw-alias-label-secondary: rgba(255, 255, 255, 0.86);
  --dsw-alias-label-tertiary: rgba(255, 255, 255, 0.76);
  --dsw-alias-label-caption: rgba(255, 255, 255, 0.70);
  --dsw-alias-label-dimmed: rgba(255, 255, 255, 0.45);
  --dsw-alias-menu-icon: #FFFFFF;
  --dsw-alias-link: #FFFFFF;
  --dsw-alias-border-l1: rgba(255, 255, 255, 0.18);
  --dsw-alias-border-l2: rgba(255, 255, 255, 0.24);
  --dsw-alias-border-l3: rgba(255, 255, 255, 0.30);
  --dsw-alias-border-l4: rgba(255, 255, 255, 0.40);
  --dsw-alias-interactive-bg-hover: rgba(255, 255, 255, 0.18);
  --dsw-alias-interactive-bg-active: rgba(255, 255, 255, 0.28);
  --dsw-alias-interactive-bg-hover-solid: rgba(255, 255, 255, 0.18);
  --dsw-alias-bg-layer-1: rgba(9, 38, 92, 0.45);
  --dsw-alias-bg-layer-2: rgba(9, 38, 92, 0.60);
  --dsw-alias-bg-layer-3: rgba(9, 38, 92, 0.35);
  --dsw-specific-selector: rgba(255, 255, 255, 0.18);
  --dsw-alias-state-business-primary: #FFFFFF;
}

/* ---- XP caption trio: the header's right-hand controls ----------------- */
/* The utilities row is the sibling immediately before the header corner, so
   this stays clear of anything rendered elsewhere in the header. The row is
   tightened into one caption group; the far-right control wears the close
   colour, mirroring the XP trio. */
div:has(+ [data-conversation-header-corner]) { gap: 2px; }
[data-conversation-header-corner] { margin-left: 2px; }

div:has(+ [data-conversation-header-corner]) button,
[data-conversation-header-corner] button {
  box-sizing: border-box;
  border: 1px solid #0E3A8A;
  border-radius: 3px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.1) 46%, rgba(255, 255, 255, 0) 47%),
    linear-gradient(180deg, #5FA6F0 0%, #2A66D2 50%, #1747A8 100%);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.18),
    0 1px 1px rgba(0, 0, 0, 0.25);
  color: #FFFFFF;
}
div:has(+ [data-conversation-header-corner]) button:hover,
[data-conversation-header-corner] button:hover {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.12) 46%, rgba(255, 255, 255, 0) 47%),
    linear-gradient(180deg, #79B8F7 0%, #3575DE 50%, #1C50B4 100%);
}
div:has(+ [data-conversation-header-corner]) button:active,
[data-conversation-header-corner] button:active {
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.45);
}

/* Split control: one tile around the whole thing, both halves transparent. */
div:has(+ [data-conversation-header-corner]) [data-open-target] {
  box-sizing: border-box;
  border: 1px solid #0E3A8A;
  border-radius: 3px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.1) 46%, rgba(255, 255, 255, 0) 47%),
    linear-gradient(180deg, #5FA6F0 0%, #2A66D2 50%, #1747A8 100%);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.18),
    0 1px 1px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}
div:has(+ [data-conversation-header-corner]) [data-open-target]:hover {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.12) 46%, rgba(255, 255, 255, 0) 47%),
    linear-gradient(180deg, #79B8F7 0%, #3575DE 50%, #1C50B4 100%);
}
div:has(+ [data-conversation-header-corner]) [data-open-target] button {
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

/* Optional: keep the header's right-hand trio down to three controls by
   hiding the schedule trigger in this row only (sidebar marks keep it).
   Delete this rule to bring the button back. */
div:has(+ [data-conversation-header-corner]) [data-schedule-reminder-entry] {
  display: none;
}

/* The right-panel expand control closes the trio with the XP close colour;
   the shipped utility buttons stay blue so the red sits where a window's
   close button would be. */
[data-conversation-header-corner] button,
[data-conversation-header-corner] [data-sidebar-right-expand] {
  border-color: #6E0F05;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.12) 46%, rgba(255, 255, 255, 0) 47%),
    linear-gradient(180deg, #F0603F 0%, #C42A17 50%, #8C0F06 100%);
}
[data-conversation-header-corner] button:hover,
[data-conversation-header-corner] [data-sidebar-right-expand]:hover {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.16) 46%, rgba(255, 255, 255, 0) 47%),
    linear-gradient(180deg, #FF7A57 0%, #D8391F 50%, #9C1407 100%);
}
[data-conversation-header-corner] button:active,
[data-conversation-header-corner] [data-sidebar-right-expand]:active {
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.5);
}

/* ---- wallpaper picker -------------------------------------------------- */
/* No wallpaper ships with the plugin. The picker is the only way an image
   enters the page: a local file is imported, downscaled, stored in
   localStorage and applied through --xp-wallpaper. */
.xp-wallpaper {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 70;
  color: #1F1F1A;
  font-family: Tahoma, "Segoe UI", sans-serif;
  font-size: 12px;
}
.xp-wallpaper__toggle,
.xp-wallpaper__button {
  box-sizing: border-box;
  border: 1px solid #003C74;
  border-radius: 3px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0.10) 46%, rgba(255, 255, 255, 0) 47%),
    linear-gradient(180deg, #FFFFFF 0%, #F2F0E7 48%, #DCD8C7 100%);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.75),
    inset 0 -1px 0 rgba(0, 0, 0, 0.10),
    0 1px 2px rgba(0, 0, 0, 0.22);
  color: #1F1F1A;
  cursor: pointer;
  font: inherit;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.85);
}
.xp-wallpaper__toggle {
  height: 28px;
  padding: 0 12px;
}
.xp-wallpaper__button {
  height: 26px;
  padding: 0 10px;
}
.xp-wallpaper__toggle:hover,
.xp-wallpaper__button:hover {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.16) 46%, rgba(255, 255, 255, 0) 47%),
    linear-gradient(180deg, #FFFFFF 0%, #FBF9F2 48%, #E7E3D5 100%);
}
.xp-wallpaper__toggle:active,
.xp-wallpaper__button:active {
  background: linear-gradient(180deg, #E2DECF 0%, #EFEBDD 100%);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.25);
}
.xp-wallpaper__panel {
  position: absolute;
  right: 0;
  bottom: 36px;
  width: 310px;
  overflow: hidden;
  border: 1px solid #003C74;
  border-radius: 6px;
  background: #ECE9D8;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
}
.xp-wallpaper__panel[hidden] {
  display: none;
}
.xp-wallpaper__title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px 4px 10px;
  background: linear-gradient(180deg, #4A9BF7 0%, #2A6FE0 44%, #1747A8 100%);
  color: #FFFFFF;
  font-weight: 700;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.30);
}
.xp-wallpaper__close {
  box-sizing: border-box;
  width: 20px;
  height: 18px;
  padding: 0;
  border: 1px solid #6E0F05;
  border-radius: 3px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.12) 46%, rgba(255, 255, 255, 0) 47%),
    linear-gradient(180deg, #F0603F 0%, #C42A17 50%, #8C0F06 100%);
  color: #FFFFFF;
  cursor: pointer;
  font: 700 13px/1 Tahoma, sans-serif;
}
.xp-wallpaper__close:hover {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.16) 46%, rgba(255, 255, 255, 0) 47%),
    linear-gradient(180deg, #FF7A57 0%, #D8391F 50%, #9C1407 100%);
}
.xp-wallpaper__body {
  padding: 10px;
}
.xp-wallpaper__status {
  margin: 0 0 8px;
}
.xp-wallpaper__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.xp-wallpaper__link {
  display: block;
  margin-top: 8px;
  color: #003399;
  font-size: 11px;
  text-decoration: underline;
}
.xp-wallpaper__note {
  margin: 8px 0 0;
  color: #5B5B52;
  font-size: 11px;
  line-height: 1.5;
}
.xp-wallpaper__error {
  margin: 8px 0 0;
  color: #B00020;
  font-size: 11px;
}
.xp-wallpaper__error[hidden] {
  display: none;
}

`;


    /** The wallpaper is local-only: nothing is bundled, fetched or uploaded. */
    const WALLPAPER_KEY = 'dsh.xp-luna.wallpaper';
    const WALLPAPER_MAX_WIDTH = 2560;
    const WALLPAPER_MAX_HEIGHT = 1600;
    const WALLPAPER_MAX_LENGTH = 4000000;
    const WALLPAPER_OFFICIAL = 'https://microsoft.design/wp-content/uploads/2025/08/microsoft_nostalgic.zip';

    const WALLPAPER_TEXT = {
      zh: {
        toggle: '壁纸',
        title: '桌面壁纸',
        close: '关闭',
        none: '尚未设置壁纸，当前使用渐变底色。',
        custom: '当前使用导入的本地壁纸。',
        import: '导入本地图片…',
        remove: '移除壁纸',
        official: '从微软官方下载推荐壁纸（zip）',
        note: '推荐使用 Microsoft_Nostalgic_Windows_Wallpaper_4k.jpg（微软官方 4K 怀旧壁纸包）。插件不附带、不自动下载该图片；导入后只保存在本机浏览器。也可以导入你自己的 Bliss.jpg，或任意 JPG / PNG / WebP。请自行确保壁纸的使用许可。',
        badType: '仅支持 JPG、JPEG、PNG、WebP。',
        badImage: '图片读取失败，请换一张试试。',
        tooLarge: '图片过大，压缩后仍无法保存到本机存储。',
        saved: '已应用壁纸。',
        removed: '已移除壁纸。',
      },
      en: {
        toggle: 'Wallpaper',
        title: 'Desktop wallpaper',
        close: 'Close',
        none: 'No wallpaper yet — using the gradient fallback.',
        custom: 'Using an imported local wallpaper.',
        import: 'Import a local image…',
        remove: 'Remove wallpaper',
        official: 'Download the recommended wallpaper from Microsoft (zip)',
        note: 'Recommended: Microsoft_Nostalgic_Windows_Wallpaper_4k.jpg from Microsoft’s official 4K nostalgic wallpaper pack. This plugin does not bundle or download it; the imported image stays in this browser. You can also import your own Bliss.jpg, or any JPG / PNG / WebP. Make sure you have the right to use the image.',
        badType: 'Only JPG, JPEG, PNG and WebP are supported.',
        badImage: 'Could not read that image. Try another file.',
        tooLarge: 'The image is too large to store locally even after compression.',
        saved: 'Wallpaper applied.',
        removed: 'Wallpaper removed.',
      },
    };

    function wallpaperText() {
      const language = typeof navigator !== 'undefined' && typeof navigator.language === 'string' ? navigator.language : '';
      return language.toLowerCase().startsWith('zh') ? WALLPAPER_TEXT.zh : WALLPAPER_TEXT.en;
    }

    function readStoredWallpaper() {
      try {
        const value = window.localStorage.getItem(WALLPAPER_KEY);
        return typeof value === 'string' && /^data:image\/(jpeg|png|webp);base64,/.test(value) ? value : undefined;
      } catch (error) {
        return undefined;
      }
    }

    function applyWallpaper(data) {
      const root = document.documentElement;
      if (typeof data === 'string' && data.startsWith('data:image/')) {
        root.style.setProperty('--xp-wallpaper', 'url("' + data + '")');
      } else {
        root.style.removeProperty('--xp-wallpaper');
      }
    }

    /**
     * The wallpaper picker: a small XP window pinned to the bottom-right.
     * Importing a local file is the only way an image enters the page; the
     * image is downscaled, re-encoded and kept in localStorage.
     */
    function createWallpaperPicker() {
      const text = wallpaperText();
      for (const stale of document.querySelectorAll('.xp-wallpaper')) stale.remove();

      const root = document.createElement('div');
      root.className = 'xp-wallpaper';

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'xp-wallpaper__toggle';
      toggle.textContent = text.toggle;
      toggle.setAttribute('aria-expanded', 'false');

      const panel = document.createElement('div');
      panel.className = 'xp-wallpaper__panel';
      panel.hidden = true;
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-label', text.title);

      const titlebar = document.createElement('div');
      titlebar.className = 'xp-wallpaper__title';
      const title = document.createElement('span');
      title.textContent = text.title;
      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'xp-wallpaper__close';
      close.setAttribute('aria-label', text.close);
      close.textContent = '\u00D7';
      titlebar.append(title, close);

      const body = document.createElement('div');
      body.className = 'xp-wallpaper__body';

      const status = document.createElement('p');
      status.className = 'xp-wallpaper__status';

      const actions = document.createElement('div');
      actions.className = 'xp-wallpaper__actions';

      const importButton = document.createElement('button');
      importButton.type = 'button';
      importButton.className = 'xp-wallpaper__button';
      importButton.textContent = text.import;

      const file = document.createElement('input');
      file.type = 'file';
      file.accept = '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp';
      file.hidden = true;

      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.className = 'xp-wallpaper__button';
      removeButton.textContent = text.remove;

      actions.append(importButton, removeButton);

      const link = document.createElement('a');
      link.className = 'xp-wallpaper__link';
      link.href = WALLPAPER_OFFICIAL;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.textContent = text.official;

      const note = document.createElement('p');
      note.className = 'xp-wallpaper__note';
      note.textContent = text.note;

      const error = document.createElement('p');
      error.className = 'xp-wallpaper__error';
      error.hidden = true;

      body.append(status, actions, link, note, error);
      panel.append(titlebar, body);
      root.append(toggle, panel, file);

      let current = readStoredWallpaper();

      function setStatus(message) {
        status.textContent =
          message !== undefined ? message : current !== undefined ? text.custom : text.none;
        removeButton.hidden = current === undefined;
      }

      function showError(message) {
        error.textContent = message;
        error.hidden = false;
      }

      function setOpen(open) {
        panel.hidden = !open;
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) {
          error.hidden = true;
          setStatus();
        }
      }

      function importFile(picked) {
        error.hidden = true;
        if (!/^image\/(jpeg|jpg|png|webp)$/.test(picked.type)) {
          showError(text.badType);
          return;
        }
        const reader = new FileReader();
        reader.onerror = function () {
          showError(text.badImage);
        };
        reader.onload = function () {
          const image = new Image();
          image.onerror = function () {
            showError(text.badImage);
          };
          image.onload = function () {
            const scale = Math.min(
              1,
              WALLPAPER_MAX_WIDTH / image.naturalWidth,
              WALLPAPER_MAX_HEIGHT / image.naturalHeight,
            );
            const width = Math.max(1, Math.round(image.naturalWidth * scale));
            const height = Math.max(1, Math.round(image.naturalHeight * scale));
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const context = canvas.getContext('2d');
            if (context === null) {
              showError(text.badImage);
              return;
            }
            context.fillStyle = '#ECE9D8';
            context.fillRect(0, 0, width, height);
            context.drawImage(image, 0, 0, width, height);
            let data;
            try {
              data = canvas.toDataURL('image/jpeg', 0.85);
            } catch (failure) {
              showError(text.badImage);
              return;
            }
            if (typeof data !== 'string' || data.length > WALLPAPER_MAX_LENGTH) {
              showError(text.tooLarge);
              return;
            }
            try {
              window.localStorage.setItem(WALLPAPER_KEY, data);
            } catch (failure) {
              showError(text.tooLarge);
              return;
            }
            current = data;
            applyWallpaper(data);
            setStatus(text.saved);
          };
          image.src = String(reader.result);
        };
        reader.readAsDataURL(picked);
      }

      function onToggle() {
        setOpen(panel.hidden);
      }
      function onClose() {
        setOpen(false);
      }
      function onImport() {
        file.click();
      }
      function onFile() {
        const picked = file.files !== null && file.files.length > 0 ? file.files[0] : undefined;
        file.value = '';
        if (picked !== undefined) importFile(picked);
      }
      function onRemove() {
        try {
          window.localStorage.removeItem(WALLPAPER_KEY);
        } catch (failure) {
          // The image is still removed from the page below.
        }
        current = undefined;
        applyWallpaper(undefined);
        setStatus(text.removed);
      }
      function onKey(event) {
        if (event.key === 'Escape' && !panel.hidden) {
          event.preventDefault();
          setOpen(false);
        }
      }

      toggle.addEventListener('click', onToggle);
      close.addEventListener('click', onClose);
      importButton.addEventListener('click', onImport);
      file.addEventListener('change', onFile);
      removeButton.addEventListener('click', onRemove);
      document.addEventListener('keydown', onKey);

      applyWallpaper(current);
      setStatus();
      if (document.body !== null) document.body.append(root);

      return {
        cleanup() {
          toggle.removeEventListener('click', onToggle);
          close.removeEventListener('click', onClose);
          importButton.removeEventListener('click', onImport);
          file.removeEventListener('change', onFile);
          removeButton.removeEventListener('click', onRemove);
          document.removeEventListener('keydown', onKey);
          root.remove();
          applyWallpaper(undefined);
        },
      };
    }

    /** One owned style element; removing it restores the host's own rendering. */
    function installStyles() {
      for (const stale of document.querySelectorAll('style[data-xp-luna]')) stale.remove();
      const element = document.createElement('style');
      element.dataset.plugin = '@local/dsh-xp-luna';
      element.dataset.xpLuna = '';
      element.textContent = CSS;
      document.head.append(element);
      return () => element.remove();
    }

    return {
      inject: ['theme'],
      apply(ctx) {
        const source = '@local/dsh-xp-luna';
        /** Token-layer disposer while the light palette is active. */
        let layer;
        /** Stylesheet disposer while the light palette is active. */
        let styles;
        /** Wallpaper picker while the light skin is mounted. */
        let picker;

        const teardown = () => {
          if (picker !== undefined) {
            const dispose = picker;
            picker = undefined;
            dispose.cleanup();
          }
          if (styles !== undefined) {
            const dispose = styles;
            styles = undefined;
            dispose();
          }
          if (layer !== undefined) {
            const dispose = layer;
            layer = undefined;
            dispose();
          }
        };

        const sync = () => {
          if (ctx.theme.getTheme().active.colorScheme === 'dark') {
            teardown();
            return;
          }
          if (layer === undefined) {
            // `overrideTokens` emits `theme/change` synchronously. Park a
            // sentinel first so that re-entrant emission sees the layer as
            // present instead of calling `overrideTokens` again forever.
            layer = () => {};
            try {
              layer = ctx.theme.overrideTokens(source, TOKENS);
            } catch (error) {
              layer = undefined;
              throw error;
            }
          }
          if (styles === undefined) styles = installStyles();
          if (picker === undefined) picker = createWallpaperPicker();
        };

        ctx.effect(() => {
          sync();
          const off = ctx.on('theme/change', sync);
          return () => {
            off();
            teardown();
          };
        }, 'xp-luna: palette and desktop layers');
      },
    };
  },
});
