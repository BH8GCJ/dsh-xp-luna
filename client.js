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
 * 3. A Settings page — a `settings.section` occupant, not a floating overlay.
 *    The Host stores the wallpaper and window settings outside the repository
 *    and serves them from same-origin routes, so they survive port changes and
 *    restarts. No wallpaper ships with the plugin.
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
  factory(require) {
    const React = require('react');
    const h = React.createElement;

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
  --xp-bg-blur: 0px;
}

/* The desktop layer: the wallpaper lives on a fixed body pseudo-element, not
   on the body background, so the desktop blur can be applied without
   filtering the app UI above it. --xp-wallpaper comes from the Host settings
   route; the gradient is the fallback until the user imports an image. */
/* The body must not paint over the fixed desktop pseudo: the body background
   paints above a negative-z-index descendant, which would hide the wallpaper
   and leave the bare blue canvas. Keep only the html colour as the fallback. */
html {
  background-color: #245EDC;
}

body {
  background: transparent !important;
}

/* Tooltips keep the XP pale-yellow bubble, but the primitives colour their
   text with a static white token. Target the bubble itself (role="tooltip")
   instead of the static palette: overriding that palette would also darken
   surfaces such as bg-base and the toast label. */
[role="tooltip"] {
  color: #1A1A1A !important;
}

/* Native selects used by plugin pages (e.g. billion-context's version
   picker) inherit the page colour while Chromium opens a light popup; on a
   dark card that produced white options on white. Pin the light scheme and
   dark ink so both the control and its list stay readable. */
select,
option {
  /* The plugin page styles its own <select> with a class, which outranks a
     bare element selector; !important keeps the control and its popup dark
     on white instead of inheriting the page's near-white text. */
  color: #1A1A1A !important;
  background-color: #FFFFFF !important;
  color-scheme: light !important;
}

/* On a dark desktop (BreezeDark, GNOME prefer-dark) the native popup follows
   the OS palette while the plugin card paints dark, so a forced light scheme
   leaves the option list light with light text. Let the control follow the
   system scheme there; a light desktop keeps the white control above. */
@media (prefers-color-scheme: dark) {
  select,
  option {
    color: #F5F5F5 !important;
    background-color: #1F1F1F !important;
    color-scheme: dark !important;
  }
}

body::before {
  content: "";
  position: fixed;
  inset: -64px;
  z-index: -1;
  background-color: #245EDC;
  background-image: var(--xp-wallpaper, linear-gradient(180deg, #4A9BF7 0%, #9CC4F2 48%, #A9C87E 52%, #6E9C46 100%));
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  filter: blur(var(--xp-bg-blur));
  pointer-events: none;
  will-change: filter;
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
  /* Inverted labels sit on white fills in the taskbar (the build-version
     pill), so they need a dark ink rather than the global white. */
  --dsw-alias-label-primary-inverted: #0B2E63;
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

/* The official wordmark draws "deepseek" with currentColor and the
   "Harness" badge as a currentColor rectangle whose letters use the
   inverted-label token. On the blue taskbar currentColor is white, which
   turned the badge into a white pill with invisible white letters. Keep the
   brand's dark badge and white letters instead. */
div:has(> [data-shell-overlay]) > div:first-child [class*="_brandName"] svg > rect {
  fill: #0B2E63;
}
div:has(> [data-shell-overlay]) > div:first-child [class*="_brandName"] svg path[fill^="var("] {
  fill: #FFFFFF;
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
  box-sizing: border-box;
  background: #ECE9D8;
  border: 1px solid #8A8678;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  isolation: isolate;
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.38);
}

/* Glass for the window. It used to be limited to pages that carried a
   conversation, plugin-bar or task-manager marker, but DSH 0.2.1-rc.5 ships
   some of those pages without the marker, which silently disabled the
   opacity slider there. Apply the material to the whole window instead. */
div:has(> [data-shell-overlay]) > div:nth-child(2) {
  background: transparent;
}

/* The glass is a masked wallpaper layer, not a backdrop-filter. A backdrop
   filter re-samples the page wallpaper on every style change, which repaints
   the image while a slider is dragged. Here the blurred copy is painted once
   in its own layer; changing the blur re-renders only this layer, and the
   tint below is a separate layer whose opacity is composited. The fixed
   attachment keeps the copy aligned with the sharp wallpaper outside. */
div:has(> [data-shell-overlay]) > div:nth-child(2)::before {
  content: "";
  position: absolute;
  inset: -64px;
  z-index: -1;
  background-image: var(--xp-wallpaper, linear-gradient(180deg, #4A9BF7 0%, #9CC4F2 48%, #A9C87E 52%, #6E9C46 100%));
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  filter: blur(var(--xp-window-blur));
  pointer-events: none;
  will-change: filter;
}

div:has(> [data-shell-overlay]) > div:nth-child(2)::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: #ECE9D8;
  opacity: var(--xp-window-alpha);
  pointer-events: none;
  will-change: opacity;
}

/* The glass is a visual choice made in the theme settings. Do not fall back
   to an opaque window when the OS reports reduced transparency: Windows
   Server and many desktops disable transparency effects by default, which
   silently made the opacity slider do nothing there. */

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
/* The market floats its search row over the results while scrolling. Instead
   of a flat beige strip, give the row its own copy of the glass: the same
   wallpaper, blur and tint as the window. It covers the cards behind it and
   keeps the same colour as the rest of the window. */
[data-dsh-market-plugins-tab="true"] [class*="_stickyHead"] {
  background: transparent !important;
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.10);
}
[data-dsh-market-plugins-tab="true"] [class*="_stickyHead"]::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image: var(--xp-wallpaper, linear-gradient(180deg, #4A9BF7 0%, #9CC4F2 48%, #A9C87E 52%, #6E9C46 100%));
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  filter: blur(var(--xp-window-blur));
  pointer-events: none;
}
[data-dsh-market-plugins-tab="true"] [class*="_stickyHead"]::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: #ECE9D8;
  opacity: var(--xp-window-alpha);
  pointer-events: none;
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

/* The Desktop preload samples the native caption palette from an invisible
   probe appended to <body>: it reads --dsw-specific-sidebar-fill for the
   strip and --dsw-alias-label-primary for the glyphs. That token is black in
   our light document, so the Windows minimize/maximize/close glyphs were
   black on the blue strip. The probe carries this fixed inline signature;
   force the symbols to white without touching the document ink. */
body > span[style*="visibility: hidden"][style*="pointer-events: none"] {
  color: #FFFFFF !important;
}

/* The conversation canvas repaints the base colour itself. Clear only that
   surface so the glass shows once; sticky covers (composer shelf, compaction
   and disclosure headers) keep the opaque token so content cannot bleed
   through them while scrolling. */
div:has(> [data-shell-overlay]) > div:nth-child(2) div[data-phase] {
  background-color: transparent;
}

/* The composer seat fades to the opaque work surface, which reads as a white
   band under the glass. Keep the glass; the composer card has its own surface.
   The attribute pair outranks the shell's .root[data-phase] .composerSeat rule. */
div[data-phase] [data-composer-seat][data-conversation-region="composer"] {
  background: none;
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

/* The session "more" menu renders inline inside the header, whose label
   tokens are white for the blue caption band, and its buttons inherited the
   caption-button paint. Put the menu surface back on dark ink and a flat
   item background so the menu reads as a menu. */
[data-menu-material] {
  --dsw-alias-label-primary: #1A1A1A;
  --dsw-alias-label-secondary: #4A4A44;
  --dsw-alias-label-caption: #5A5A52;
  --dsw-alias-menu-icon: #1A1A1A;
  --dsw-alias-interactive-bg-hover: rgba(49, 106, 197, 0.10);
}
[data-menu-material] [role="menuitem"] {
  border: 0 !important;
  border-radius: var(--dsw-radius-md, 6px) !important;
  background: transparent !important;
  box-shadow: none !important;
  color: #1A1A1A !important;
}
[data-menu-material] [role="menuitem"]:hover {
  background: rgba(49, 106, 197, 0.10) !important;
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

/* ---- settings page ---------------------------------------------------- */
/* A whole page in Settings (settings.section), not a floating overlay. It
   edits the wallpaper and the window material; the Host persists both. */
.xp-settings {
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 720px;
  color: var(--dsw-alias-label-primary);
}
.xp-settings__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}
.xp-settings__intro {
  margin: -8px 0 0;
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 1.6;
}
.xp-settings__section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border: 1px solid var(--dsw-alias-border-l4);
  border-radius: 6px;
  background: var(--dsw-alias-bg-base);
}
.xp-settings__heading {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}
.xp-settings__preview {
  position: relative;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 1px solid var(--dsw-alias-border-l4);
  border-radius: 4px;
  background: linear-gradient(180deg, #4A9BF7 0%, #9CC4F2 48%, #A9C87E 52%, #6E9C46 100%);
}
.xp-settings__preview img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.xp-settings__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
.xp-settings__row label {
  min-width: 96px;
  font-size: 13px;
}
.xp-settings__row input[type="range"] {
  flex: 1;
  min-width: 120px;
}
.xp-settings__value {
  min-width: 44px;
  text-align: right;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
.xp-settings__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.xp-settings__button {
  box-sizing: border-box;
  height: 28px;
  padding: 0 12px;
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
.xp-settings__button:hover {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.16) 46%, rgba(255, 255, 255, 0) 47%),
    linear-gradient(180deg, #FFFFFF 0%, #FBF9F2 48%, #E7E3D5 100%);
}
.xp-settings__button:active {
  background: linear-gradient(180deg, #E2DECF 0%, #EFEBDD 100%);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.25);
}
.xp-settings__button:disabled {
  background: linear-gradient(180deg, #F4F2EA 0%, #E6E2D5 100%);
  color: rgba(31, 31, 26, 0.45);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.5);
}
.xp-settings__link {
  color: #003399;
  font-size: 12px;
  text-decoration: underline;
}
.xp-settings__hint {
  margin: 0;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 1.6;
}
.xp-settings__status {
  margin: 0;
  color: #1F6B1F;
  font-size: 12px;
}
.xp-settings__error {
  margin: 0;
  color: #B00020;
  font-size: 12px;
}
.xp-settings__loading {
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
}

`;

    /** Same-origin routes owned by the Host half. */
    const SETTINGS_ROUTE = '/dsh-xp-luna/settings';
    const WALLPAPER_ROUTE = '/dsh-xp-luna/wallpaper';
    const WALLPAPER_OFFICIAL = 'https://microsoft.design/wp-content/uploads/2025/08/microsoft_nostalgic.zip';
    const DEFAULT_SETTINGS = { alpha: 0.75, blur: 4, backgroundBlur: 0 };

    const LUNA_TEXT = {
      zh: {
        settingsNav: 'XP Luna 主题',
        title: 'XP Luna 主题设置',
        intro: '调整壁纸和窗口材质。设置保存在 DSH 数据目录（不在仓库里），壁纸只在你自己的机器上。',
        wallpaper: '桌面壁纸',
        wallpaperOn: '当前使用已导入的壁纸。',
        wallpaperNone: '尚未设置壁纸，当前使用渐变底色。',
        import: '导入本地图片…',
        remove: '移除壁纸',
        removeNote: '移除后会删除本机保存的壁纸文件，并恢复主题默认渐变背景。',
        official: '从微软官方渠道下载推荐壁纸（ZIP）',
        recommended: '推荐：Microsoft_Nostalgic_Windows_Wallpaper_4k.jpg（微软官方 4K 怀旧壁纸包）。插件不附带、不自动下载；请从微软官方下载解压后导入。',
        supports: '支持 JPG、JPEG、PNG、WebP；也可以导入你自己的 Bliss.jpg。请确保你有权使用该图片。',
        small: '这张图只有 {0}×{1}，铺满窗口可能显得模糊；建议使用 1920×1080 以上的图片。',
        window: '窗口与背景',
        alpha: '窗口不透明度',
        blur: '窗口背景模糊',
        backgroundBlur: '桌面背景模糊',
        autoSaving: '正在自动保存…',
        autoSaved: '已自动保存。',
        autoHint: '拖动即时生效，松开后自动保存。',
        saveFailed: '保存失败，请稍后重试。',
        wallpaperSaved: '壁纸已保存。',
        wallpaperFailed: '壁纸操作失败，请稍后重试。',
        removed: '壁纸已移除。',
        badType: '仅支持 JPG、JPEG、PNG、WebP。',
        lightOnly: '这些样式只在浅色模式下生效。',
        statusUnavailable: '无法读取设置，请确认插件已启用并重启桌面应用。',
        loading: '正在读取设置…',
        previewAlt: '当前壁纸预览',
      },
      en: {
        settingsNav: 'XP Luna theme',
        title: 'XP Luna settings',
        intro: 'Adjust the wallpaper and the window material. Settings live in the DSH data directory (not in the repository); the wallpaper stays on your machine.',
        wallpaper: 'Desktop wallpaper',
        wallpaperOn: 'Using the imported wallpaper.',
        wallpaperNone: 'No wallpaper yet — using the gradient fallback.',
        import: 'Import a local image…',
        remove: 'Remove wallpaper',
        removeNote: 'Removing it deletes the wallpaper file stored on this machine and restores the theme\u2019s default gradient.',
        official: 'Download the recommended wallpaper from Microsoft\u2019s official source (ZIP)',
        recommended: 'Recommended: Microsoft_Nostalgic_Windows_Wallpaper_4k.jpg from Microsoft’s official 4K nostalgic wallpaper pack. This plugin does not bundle or download it; download it from Microsoft and import the extracted JPG.',
        supports: 'JPG, JPEG, PNG and WebP are supported; your own Bliss.jpg works too. Make sure you have the right to use the image.',
        small: 'This image is only {0}×{1}; it may look blurry when stretched. 1920×1080 or larger is recommended.',
        window: 'Window & background',
        alpha: 'Window opacity',
        blur: 'Window blur',
        backgroundBlur: 'Desktop blur',
        autoSaving: 'Saving automatically…',
        autoSaved: 'Saved automatically.',
        autoHint: 'Changes apply as you drag and save automatically.',
        saveFailed: 'Could not save the settings. Try again.',
        wallpaperSaved: 'Wallpaper saved.',
        wallpaperFailed: 'The wallpaper operation failed. Try again.',
        removed: 'Wallpaper removed.',
        badType: 'Only JPG, JPEG, PNG and WebP are supported.',
        lightOnly: 'These styles only apply in light mode.',
        statusUnavailable: 'Could not read the settings. Make sure the plugin is enabled and restart the desktop app.',
        loading: 'Reading settings…',
        previewAlt: 'Current wallpaper preview',
      },
    };

    function lunaText() {
      const language = typeof navigator !== 'undefined' && typeof navigator.language === 'string' ? navigator.language : '';
      return language.toLowerCase().startsWith('zh') ? LUNA_TEXT.zh : LUNA_TEXT.en;
    }

    /**
     * Apply the material, and touch the wallpaper only when it actually
     * changed. Re-setting --xp-wallpaper to a cache-busted URL on every
     * slider tick makes the browser fetch and decode the image again, which
     * flashes the desktop colour behind the glass. `forceWallpaper` is for
     * the import/remove actions, not for material changes.
     */
    function applyRemoteSettings(settings, forceWallpaper = false) {
      const root = document.documentElement;
      const alpha = typeof settings?.alpha === 'number' ? Math.min(1, Math.max(0.5, settings.alpha)) : DEFAULT_SETTINGS.alpha;
      const blur = typeof settings?.blur === 'number' ? Math.min(20, Math.max(0, Math.round(settings.blur))) : DEFAULT_SETTINGS.blur;
      const backgroundBlur = typeof settings?.backgroundBlur === 'number' ? Math.min(20, Math.max(0, Math.round(settings.backgroundBlur))) : DEFAULT_SETTINGS.backgroundBlur;
      root.style.setProperty('--xp-window-alpha', String(alpha));
      root.style.setProperty('--xp-window-blur', blur + 'px');
      root.style.setProperty('--xp-bg-blur', backgroundBlur + 'px');
      if (settings?.wallpaper !== true) {
        root.style.removeProperty('--xp-wallpaper');
        return;
      }
      if (!forceWallpaper && root.style.getPropertyValue('--xp-wallpaper') !== '') return;
      const suffix = forceWallpaper ? '?t=' + Date.now() : '';
      root.style.setProperty('--xp-wallpaper', 'url("' + WALLPAPER_ROUTE + suffix + '")');
    }

    function clearRemoteSettings() {
      const root = document.documentElement;
      root.style.removeProperty('--xp-window-alpha');
      root.style.removeProperty('--xp-window-blur');
      root.style.removeProperty('--xp-wallpaper');
    }

    async function fetchRemoteSettings() {
      const response = await fetch(SETTINGS_ROUTE, { headers: { accept: 'application/json' } });
      if (!response.ok) throw new Error('http ' + response.status);
      return await response.json();
    }

    /** The whole Settings page; registered through `settings.section`. */
    function XpLunaSettings() {
      const text = lunaText();
      const [settings, setSettings] = React.useState(null);
      const [busy, setBusy] = React.useState(false);
      const [status, setStatus] = React.useState('');
      const [error, setError] = React.useState('');
      const [preview, setPreview] = React.useState(0);
      const [dimensions, setDimensions] = React.useState(null);
      const file = React.useRef(null);
      const timer = React.useRef(null);
      const latest = React.useRef(null);
      const sequence = React.useRef(0);

      React.useEffect(() => {
        let alive = true;
        fetchRemoteSettings()
          .then((value) => {
            if (alive) {
              latest.current = value;
              setSettings(value);
            }
          })
          .catch(() => {
            if (!alive) return;
            setError(text.statusUnavailable);
            setSettings({ ...DEFAULT_SETTINGS, wallpaper: false });
          });
        return () => {
          alive = false;
        };
      }, []);

      // Flush the last slider position if the page closes during the debounce.
      React.useEffect(() => () => {
        if (timer.current !== null) {
          window.clearTimeout(timer.current);
          timer.current = null;
          const pending = latest.current;
          if (pending !== null) void persist(pending, ++sequence.current);
        }
      }, []);

      if (settings === null) {
        return h('p', { className: 'xp-settings__loading' }, text.loading);
      }

      const update = (key, value) => {
        const next = { ...settings, [key]: value };
        latest.current = next;
        setSettings(next);
        applyRemoteSettings(next);
        setError('');
        setStatus(text.autoSaving);
        const seq = ++sequence.current;
        if (timer.current !== null) window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => {
          timer.current = null;
          void persist(next, seq);
        }, 300);
      };

      async function persist(next, seq) {
        try {
          const response = await fetch(SETTINGS_ROUTE, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ alpha: next.alpha, blur: next.blur, backgroundBlur: next.backgroundBlur }),
          });
          if (!response.ok) throw new Error('http ' + response.status);
          const saved = await response.json();
          if (seq !== sequence.current) return;
          // Keep the wallpaper flag owned by upload/remove; only the material
          // values belong to this save. Fall back to the value we sent when an
          // older Host does not know a field yet.
          const alpha = typeof saved.alpha === 'number' ? saved.alpha : next.alpha;
          const blur = typeof saved.blur === 'number' ? saved.blur : next.blur;
          const backgroundBlur = typeof saved.backgroundBlur === 'number' ? saved.backgroundBlur : next.backgroundBlur;
          setSettings((current) => ({ ...current, alpha, blur, backgroundBlur }));
          latest.current = { ...latest.current, alpha, blur, backgroundBlur };
          setStatus(text.autoSaved);
        } catch (failure) {
          if (seq !== sequence.current) return;
          setError(text.saveFailed);
        }
      }

      const upload = async (picked) => {
        if (!/^image\/(jpeg|jpg|png|webp)$/.test(picked.type)) {
          setError(text.badType);
          return;
        }
        setBusy(true);
        setStatus('');
        setError('');
        try {
          const response = await fetch(WALLPAPER_ROUTE, {
            method: 'POST',
            headers: { 'content-type': picked.type },
            body: picked,
          });
          if (!response.ok) throw new Error('http ' + response.status);
          const next = { ...settings, wallpaper: true };
          latest.current = next;
          setSettings(next);
          setPreview(Date.now());
          setDimensions(null);
          applyRemoteSettings(next, true);
          setStatus(text.wallpaperSaved);
        } catch (failure) {
          setError(text.wallpaperFailed);
        } finally {
          setBusy(false);
        }
      };

      const remove = async () => {
        setBusy(true);
        setStatus('');
        setError('');
        try {
          const response = await fetch(WALLPAPER_ROUTE, { method: 'DELETE' });
          if (!response.ok) throw new Error('http ' + response.status);
          const next = { ...settings, wallpaper: false };
          latest.current = next;
          setSettings(next);
          applyRemoteSettings(next);
          setStatus(text.removed);
        } catch (failure) {
          setError(text.wallpaperFailed);
        } finally {
          setBusy(false);
        }
      };

      const dimensionsHint =
        dimensions !== null && dimensions[0] > 0 && dimensions[0] < 1920
          ? text.small.replace('{0}', String(dimensions[0])).replace('{1}', String(dimensions[1]))
          : '';

      return h('div', { className: 'xp-settings' },
        h('h2', { className: 'xp-settings__title' }, text.title),
        h('p', { className: 'xp-settings__intro' }, text.intro),
        h('section', { className: 'xp-settings__section' },
          h('h3', { className: 'xp-settings__heading' }, text.wallpaper),
          h('div', { className: 'xp-settings__preview' },
            settings.wallpaper
              ? h('img', {
                  src: WALLPAPER_ROUTE + '?t=' + preview,
                  alt: text.previewAlt,
                  onLoad: (event) => {
                    const image = event.currentTarget;
                    setDimensions([image.naturalWidth, image.naturalHeight]);
                  },
                })
              : null,
          ),
          h('p', { className: 'xp-settings__hint' }, settings.wallpaper ? text.wallpaperOn : text.wallpaperNone),
          h('div', { className: 'xp-settings__actions' },
            h('button', {
              type: 'button',
              className: 'xp-settings__button',
              disabled: busy,
              onClick: () => file.current?.click(),
            }, text.import),
            settings.wallpaper
              ? h('button', { type: 'button', className: 'xp-settings__button', disabled: busy, onClick: remove }, text.remove)
              : null,
            h('input', {
              ref: file,
              type: 'file',
              accept: '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp',
              hidden: true,
              onChange: (event) => {
                const input = event.currentTarget;
                const picked = input.files !== null && input.files.length > 0 ? input.files[0] : undefined;
                input.value = '';
                if (picked !== undefined) upload(picked);
              },
            }),
          ),
          settings.wallpaper ? h('p', { className: 'xp-settings__hint' }, text.removeNote) : null,
          h('a', { className: 'xp-settings__link', href: WALLPAPER_OFFICIAL, target: '_blank', rel: 'noreferrer' }, text.official),
          h('p', { className: 'xp-settings__hint' }, text.recommended),
          h('p', { className: 'xp-settings__hint' }, text.supports),
          dimensionsHint !== '' ? h('p', { className: 'xp-settings__hint' }, dimensionsHint) : null,
        ),
        h('section', { className: 'xp-settings__section' },
          h('h3', { className: 'xp-settings__heading' }, text.window),
          h('div', { className: 'xp-settings__row' },
            h('label', { htmlFor: 'xp-luna-alpha' }, text.alpha),
            h('input', {
              id: 'xp-luna-alpha',
              type: 'range',
              min: 50,
              max: 100,
              step: 1,
              value: Math.round(Number(settings.alpha ?? 0.75) * 100),
              onChange: (event) => update('alpha', Number(event.currentTarget.value) / 100),
            }),
            h('span', { className: 'xp-settings__value' }, Math.round(Number(settings.alpha ?? 0.75) * 100) + '%'),
          ),
          h('div', { className: 'xp-settings__row' },
            h('label', { htmlFor: 'xp-luna-blur' }, text.blur),
            h('input', {
              id: 'xp-luna-blur',
              type: 'range',
              min: 0,
              max: 20,
              step: 1,
              value: settings.blur,
              onChange: (event) => update('blur', Number(event.currentTarget.value)),
            }),
            h('span', { className: 'xp-settings__value' }, settings.blur + 'px'),
          ),
          h('div', { className: 'xp-settings__row' },
            h('label', { htmlFor: 'xp-luna-bg-blur' }, text.backgroundBlur),
            h('input', {
              id: 'xp-luna-bg-blur',
              type: 'range',
              min: 0,
              max: 20,
              step: 1,
              value: settings.backgroundBlur ?? 0,
              onChange: (event) => update('backgroundBlur', Number(event.currentTarget.value)),
            }),
            h('span', { className: 'xp-settings__value' }, (settings.backgroundBlur ?? 0) + 'px'),
          ),
          h('p', { className: 'xp-settings__hint' }, text.autoHint),
          h('p', { className: 'xp-settings__hint' }, text.lightOnly),
        ),
        status !== '' ? h('p', { className: 'xp-settings__status' }, status) : null,
        error !== '' ? h('p', { className: 'xp-settings__error' }, error) : null,
      );
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
      inject: ['theme', 'slots'],
      apply(ctx) {
        ctx.slots.inject('settings.section', () =>
          ctx.slots.register({
            name: 'settings.section',
            id: 'xp-luna',
            order: 35,
            label: () => lunaText().settingsNav,
          }, XpLunaSettings));

        const source = '@local/dsh-xp-luna';
        /** Token-layer disposer while the light palette is active. */
        let layer;
        /** Stylesheet disposer while the light palette is active. */
        let styles;
        /** Guards async settings reads against a later teardown. */
        let settingsRequest = 0;

        const teardown = () => {
          settingsRequest += 1;
          clearRemoteSettings();
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
          const request = ++settingsRequest;
          fetchRemoteSettings()
            .then((settings) => {
              if (request === settingsRequest) applyRemoteSettings(settings);
            })
            .catch(() => {
              // No Host routes (e.g. an older host): keep the CSS defaults.
            });
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
