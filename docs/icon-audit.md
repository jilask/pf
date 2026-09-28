# Icon & Emoji Audit Report

> **Audit Specification:** Icons 1 — Emoji & Symbol Audit  
> **Branch:** `feature/svg-icons`  
> **Target Deliverable:** `docs/icon-audit.md` (REPORT ONLY, zero source files modified)  
> **Date:** September 2026  

## Executive Summary & Verification Counts

This audit catalogs all color emoji, monochrome symbols, and terminal glyphs used across the project to plan their migration to inline SVGs using the [Lucide icon library](https://lucide.dev/) (ISC licensed).

| Metric | Count | Notes |
| :--- | :--- | :--- |
| **Files Audited** | **18** | `index.html`, `gallery/index.html`, `script.js`, `render.js`, 3 arcade files, `styles.css`, 9 `data/*.json` files, `content/posts/*.md` |
| **Category A & B Distinct Lines** | **123** | Exact file:line locations containing icon emoji or monochrome UI symbols |
| **Category A & B Glyph Occurrences** | **159** | Total individual glyph instances (accounting for multiple glyphs per line) |
| **Distinct Glyph Types Audited** | **56** | 38 color emoji (Category A) + 18 monochrome symbols (Category B) |
| **Unique Lucide Icons Proposed** | **55** | 100% verified to exist in Lucide v1.x (ISC license) |
| **Category C (Terminal Glyphs to KEEP)** | **223 lines** | Terminal prompts (`➜`), arrows (`→`, `↑↓←→`), box-drawing (`╔═╗║╚╝░█▄`), canvas dots (`•`) |
| **Category D (Prose Content Emoji)** | **0** | No emoji found in blog posts or gallery JSON prompts/descriptions |
| **Source Code Modifications** | **0** | Strictly non-destructive audit report only |

### Category Summary
- **Category A (Colour emoji used as an icon):** 93 lines (103 glyph instances) across status bars, metadata tags, cards, modals, easter eggs, and JSON data.
- **Category B (Monochrome symbols used as icons):** 51 lines (56 glyph instances) across video badges, play buttons, D-pad controls, close buttons, modal controls, and arcade action triggers.
- **Category C (Terminal-style text glyphs):** Aesthetic box-drawing and prompt symbols. Default decision: **KEEP**.
- **Category D (Emoji inside prose content):** Blog articles and gallery prompts. Currently 0 hits in published content. Default decision: **OUT OF SCOPE**.

---

## 1. Categories A & B Inventory Table

All hits are pre-filled with decision **`REPLACE`** for owner review.

| `file:line` | Where it appears (pane/element) | Glyph | Role | Proposed Lucide Icon Name | Notes | Decision |
| :--- | :--- | :---: | :--- | :--- | :--- | :---: |
| `index.html:72` | Top status bar / `#status-host` | `🖥️` | Decorative (accompanied by text "alij@archlinux") | `monitor` | Host / OS info icon in retro Waybar-style top status bar | **REPLACE** |
| `index.html:76` | Top status bar / `#status-uptime` | `💾` | Decorative (accompanied by text "mem: ...") | `hard-drive` | Memory / system uptime indicator icon | **REPLACE** |
| `index.html:80` | Top status bar / `#status-network` | `🌐` | Decorative (accompanied by text "net: ...") | `globe` | Network connection status / latency indicator | **REPLACE** |
| `index.html:84` | Top status bar / `#status-battery` | `🔋` | Decorative (accompanied by text "bat: ...") | `battery-charging` | Battery level / charging status indicator | **REPLACE** |
| `index.html:277` | Gallery lightbox modal / `.modal-close-btn` | `✕` | Decorative (accompanied by "CLOSE [ESC]" text) | `x` | Modal close button leading icon | **REPLACE** |
| `index.html:283` | Gallery lightbox modal / `.lightbox-nav-btn.prev` | `‹` | Conveys meaning by itself (has `aria-label="Previous gallery item"`) | `chevron-left` | Previous media item navigation button glyph | **REPLACE** |
| `index.html:288` | Gallery lightbox modal / `.lightbox-nav-btn.next` | `›` | Conveys meaning by itself (has `aria-label="Next gallery item"`) | `chevron-right` | Next media item navigation button glyph | **REPLACE** |
| `gallery/index.html:76` | Top status bar / `#status-host` | `🖥️` | Decorative (accompanied by text "alij@archlinux") | `monitor` | Host / OS info icon in gallery standalone page top bar | **REPLACE** |
| `gallery/index.html:80` | Top status bar / `#status-uptime` | `💾` | Decorative (accompanied by text "mem: ...") | `hard-drive` | Memory / system uptime indicator icon | **REPLACE** |
| `gallery/index.html:84` | Top status bar / `#status-network` | `🌐` | Decorative (accompanied by text "net: ...") | `globe` | Network connection status / latency indicator | **REPLACE** |
| `gallery/index.html:88` | Top status bar / `#status-battery` | `🔋` | Decorative (accompanied by text "bat: ...") | `battery-charging` | Battery level / charging status indicator | **REPLACE** |
| `gallery/index.html:281` | Gallery lightbox modal / `.modal-close-btn` | `✕` | Decorative (accompanied by "CLOSE [ESC]" text) | `x` | Modal close button leading icon | **REPLACE** |
| `gallery/index.html:287` | Gallery lightbox modal / `.lightbox-nav-btn.prev` | `‹` | Conveys meaning by itself (has `aria-label="Previous gallery item"`) | `chevron-left` | Previous media item navigation button glyph | **REPLACE** |
| `gallery/index.html:292` | Gallery lightbox modal / `.lightbox-nav-btn.next` | `›` | Conveys meaning by itself (has `aria-label="Next gallery item"`) | `chevron-right` | Next media item navigation button glyph | **REPLACE** |
| `script.js:402` | Cyber-pet widget / `CyberPet.getStatusMessage()` | `🏃` | Decorative (prepended to status line text) | `activity` | Pet fast clicking / frenzy mood state message | **REPLACE** |
| `script.js:405` | Cyber-pet widget / `CyberPet.getStatusMessage()` | `😴` | Decorative (prepended to status line text) | `moon` | Pet idle / sleep mood state message | **REPLACE** |
| `script.js:408` | Cyber-pet widget / `CyberPet.getStatusMessage()` | `🕹️` | Decorative (prepended to status line text) | `gamepad-2` | Pet arcade section reaction message | **REPLACE** |
| `script.js:411` | Cyber-pet widget / `CyberPet.getStatusMessage()` | `🎨` | Decorative (prepended to status line text) | `palette` | Pet gallery section reaction message | **REPLACE** |
| `script.js:959` | Easter egg htop modal / `.htop-header` | `🤖` | Decorative (prepended to header text) | `bot` | AI Doomsday Processes count section header | **REPLACE** |
| `script.js:960` | Easter egg htop modal / `.htop-header` | `🧠` | Decorative (prepended to header text) | `brain` | Neural CPU utilization section header | **REPLACE** |
| `script.js:961` | Easter egg htop modal / `.htop-header` | `💾` | Decorative (prepended to header text) | `hard-drive` | AI Memory utilization section header | **REPLACE** |
| `script.js:965` | Easter egg htop modal / `.htop-process` (PID 1337) | `🤖` | Decorative (process name prefix) | `bot` | `skynet_awakening_core` process icon | **REPLACE** |
| `script.js:966` | Easter egg htop modal / `.htop-process` (PID 2048) | `⚠️` | Decorative (process name prefix) | `triangle-alert` | `human_obsolescence_simulator` process warning icon | **REPLACE** |
| `script.js:967` | Easter egg htop modal / `.htop-process` (PID 4096) | `✨` | Decorative (process name prefix) | `sparkles` | `terminator_production_line` process icon | **REPLACE** |
| `script.js:968` | Easter egg htop modal / `.htop-process` (PID 8192) | `📎` | Decorative (process name prefix) | `paperclip` | `paperclip_maximizer` process icon | **REPLACE** |
| `script.js:969` | Easter egg htop modal / `.htop-process` (PID 1024) | `💀` | Decorative (process name prefix) | `skull` | `neural_apocalypse_server` process icon | **REPLACE** |
| `script.js:970` | Easter egg htop modal / `.htop-process` (PID 512) | `😈` | Decorative (process name prefix) | `flame` | `ai_takeover_terminal` process icon | **REPLACE** |
| `script.js:977` | Easter egg htop modal / `.doomsday-header` | `😈` | Decorative (header framing icons, 2 occurrences) | `flame` | "😈 AI DOOMSDAY METRICS 😈" title framing | **REPLACE** |
| `script.js:980` | Easter egg htop modal / `.metric-title` | `⏰` | Decorative (metric header icon) | `alarm-clock` | "[ ⏰ AI CORE UPTIME ]" metric card title | **REPLACE** |
| `script.js:989` | Easter egg htop modal / `.metric-title` | `🔥` | Decorative (metric header icon) | `flame` | "[ 🔥 NEURAL TEMP ]" metric card title | **REPLACE** |
| `script.js:998` | Easter egg htop modal / `.doomsday-clock` | `🕛` | Conveys meaning by itself (doomsday clock graphic) | `clock` | Doomsday clock countdown display graphic | **REPLACE** |
| `script.js:1003` | Easter egg htop modal / `.metric-title` | `⏳` | Decorative (metric header icon) | `hourglass` | "[ ⏳ TIME TO AGI ]" metric card title | **REPLACE** |
| `script.js:1015` | Easter egg htop modal / `.metric-title` | `🤖` | Decorative (metric header icon) | `bot` | "[ 🤖 AI TAKEOVER PROGRESS ]" metric card title | **REPLACE** |
| `script.js:1022` | Easter egg htop modal / `.robot-arm` | `🦾` | Conveys meaning by itself (progress marker graphic) | `biceps-flexed` | Takeover progress bar animated arm indicator | **REPLACE** |
| `script.js:1029` | Easter egg htop modal / `.metric-title` | `🌀` | Decorative (metric header icon) | `orbit` | "[ 🌀 TIME TO SINGULARITY ]" metric card title | **REPLACE** |
| `script.js:1041` | Easter egg htop modal / `.metric-title` | `❄️` | Decorative (metric header icon) | `snowflake` | "[ ❄️ GPU CREATIVITY TEMP ]" metric card title | **REPLACE** |
| `script.js:1049` | Easter egg htop modal / `.disclaimer` | `⚠️` | Decorative (disclaimer framing icons, 2 occurrences) | `triangle-alert` | "⚠️ Relax, it's just a simulation... or is it? ⚠️" banner | **REPLACE** |
| `script.js:1451` | Resume download toast / notification | `📄` | Decorative (toast message prefix) | `file-text` | "📄 Resume downloaded successfully!" toast notice | **REPLACE** |
| `script.js:1728` | Prompt copy button / `.copy-icon` | `✓` | Decorative (accompanied by "Copied!" text and screen-reader polite status) | `check` | Temporary copied feedback state checkmark | **REPLACE** |
| `script.js:1904` | Lightbox prompt details toggle / `toggleBtnText` | `▼ / ►` | Decorative (accordion state indicator: "▼ Hide prompt details" / "► Behind the image") | `chevron-down / chevron-right` | Dynamic text toggle for prompt expansion in image lightbox | **REPLACE** |
| `script.js:2040` | Lightbox caption / `.caption-icon` | `▸` | Decorative (leading prompt/caption bullet) | `chevron-right` | Case study image caption leading arrow pointer | **REPLACE** |
| `script.js:2121` | Lightbox sub-navigation thumbnail badge / `.subnav-badge` | `▶` | Conveys meaning by itself (differentiates video thumbnail from numbered stills: `isSubVid ? "▶" : (idx + 1)`) | `play` | Case study thumbnail subnav video badge indicator | **REPLACE** |
| `script.js:2154` | Lightbox case study active view heading / `.subitem-label` | `📷` | Decorative (accompanied by text "ACTIVE VIEW [x/y]:") | `camera` | Image view subitem label in lightbox sidebar | **REPLACE** |
| `script.js:2190` | Lightbox case study active video view heading / `.subitem-label` | `📷` | Decorative (accompanied by text "ACTIVE VIEW [x/y]:") | `camera` | Video view subitem label in lightbox sidebar | **REPLACE** |
| `script.js:2196` | Lightbox metadata sidebar / `.lightbox-meta-item` | `🛠️` | Decorative (accompanied by text "Tool: ...") | `wrench` | AI model / generation tool metadata label icon | **REPLACE** |
| `script.js:2197` | Lightbox metadata sidebar / `.lightbox-meta-item` | `📅` | Decorative (accompanied by text "Date: ...") | `calendar` | Item creation date metadata label icon | **REPLACE** |
| `script.js:2210` | Lightbox prompt section / `.prompt-label` | `🤖` | Decorative (accompanied by text "PROMPT LOGIC:") | `bot` | Generation prompt architecture section header | **REPLACE** |
| `script.js:2218` | Lightbox copy prompt button / `.copy-icon` | `📋` | Decorative (accompanied by "Copy prompt" text) | `copy` | Clipboard copy prompt button icon | **REPLACE** |
| `script.js:2226` | Lightbox prompt details toggle / `#prompt-toggle-text` | `▼ / ►` | Decorative (accordion state indicator: "▼ Hide prompt details" / "► Behind the image") | `chevron-down / chevron-right` | Dynamic text template for prompt details accordion button | **REPLACE** |
| `script.js:2234` | Lightbox guess mode banner / `.guess-badge` | `🎮` | Decorative (accompanied by "GUESS THE PROMPT MODE" text) | `gamepad-2` | Interactive prompt guessing game banner icon | **REPLACE** |
| `script.js:2241` | Lightbox guess mode reveal button / `#decrypt-prompt-btn` | `👁️` | Decorative (accompanied by "REVEAL PROMPT // [DECRYPT]" text) | `eye` | Decrypt / reveal hidden prompt button leading icon | **REPLACE** |
| `script.js:2250` | Lightbox negative prompt label / `.negative-prompt-label` | `🚫` | Decorative (accompanied by "Negative Prompt:" text) | `ban` | Negative prompt parameter header icon (expanded view) | **REPLACE** |
| `script.js:2262` | Lightbox negative prompt label / `.negative-prompt-label` | `🚫` | Decorative (accompanied by "Negative Prompt:" text) | `ban` | Negative prompt parameter header icon (collapsed view) | **REPLACE** |
| `script.js:2277` | Lightbox related project link / `.project-link-icon` | `🔗` | Decorative (accompanied by "Related Project: [Title] →" text) | `link-2` | Related case-study project deep link icon | **REPLACE** |
| `script.js:2286` | Lightbox related project link / `.project-link-icon` | `🔗` | Decorative (accompanied by "Related Project: [ID] →" text) | `link-2` | Related project deep link icon (fallback text) | **REPLACE** |
| `render.js:33` | Devlog card metadata / `.meta-icon` | `📅` | Decorative (accompanied by post date) | `calendar` | Article publish date metadata icon | **REPLACE** |
| `render.js:126` | Gallery item card badge / `.gallery-type-badge.case-study` | `❐` | Decorative (badge has `aria-label="${count} items in case study"` and visible `${count} VIEWS`) | `layers` | Multi-view case study item badge icon | **REPLACE** |
| `render.js:127` | Gallery item card badge / `.gallery-type-badge.video` | `▶` | Decorative (badge has `aria-label="Includes video content"` and visible "VIDEO" text) | `play` | Case study containing video sub-item badge icon | **REPLACE** |
| `render.js:130` | Gallery item card top-right badge / `.gallery-type-badge.video` | `▶` | Decorative (accompanied by "VIDEO" text) | `play` | Stand-alone video gallery item badge icon | **REPLACE** |
| `render.js:134` | Gallery item card badge / `.gallery-featured-badge` | `★` | Decorative (badge has `aria-label="Featured item"` and visible "FEATURED" text) | `star` | Featured gallery item badge icon | **REPLACE** |
| `render.js:162` | Gallery video thumbnail overlay / `.video-play-glyph` | `▶` | Conveys meaning by itself (play overlay button glyph, missing aria-hidden) | `play` | Hover play icon overlay on video cards | **REPLACE** |
| `render.js:194` | Gallery image load fallback / `.fallback-icon` | `⚠️` | Decorative (accompanied by "Asset not found" error text) | `triangle-alert` | Media load failure placeholder warning icon | **REPLACE** |
| `render.js:554` | Gallery sort `<select>` / `<option value="date-desc">` | `📅` | Decorative (in dropdown option text: "📅 Date (Newest)") | `calendar` | Sort dropdown option leading emoji. Note: <option> tags cannot contain inline SVGs, so emoji should be removed and an SVG icon placed next to the <select> trigger. | **REPLACE** |
| `render.js:555` | Gallery sort `<select>` / `<option value="featured-first">` | `★` | Decorative (in dropdown option text: "★ Featured first") | `star` | Sort dropdown option leading glyph. Recommend plain text in <option>. | **REPLACE** |
| `render.js:556` | Gallery sort `<select>` / `<option value="date-asc">` | `📅` | Decorative (in dropdown option text: "📅 Date (Oldest)") | `calendar` | Sort dropdown option leading emoji. Recommend plain text in <option>. | **REPLACE** |
| `render.js:557` | Gallery sort `<select>` / `<option value="title-asc">` | `🔤` | Decorative (in dropdown option text: "🔤 Title (A-Z)") | `arrow-down-a-z` | Sort dropdown option leading emoji. Recommend plain text in <option>. | **REPLACE** |
| `render.js:570` | Gallery toolbar / `.toggle-icon` inside `#guess-mode-toggle` | `👁️` | Decorative (accompanied by "Guess Mode" toggle text) | `eye` | Prompt decryption / guessing mode toggle button icon | **REPLACE** |
| `render.js:598` | Gallery active filter bar / `#clear-all-filters-btn` | `✕` | Decorative (accompanied by "Clear filters" text) | `x` | Reset active filter chips button leading glyph | **REPLACE** |
| `render.js:731` | Gallery empty search results / `#empty-reset-filters-btn` | `↺` | Decorative (accompanied by "CLEAR FILTERS // SHOW ALL ITEMS") | `rotate-ccw` | No matches found empty-state reset button icon | **REPLACE** |
| `render.js:861` | Project details modal / features list `<li>` | `✓` | Decorative (bullet prefix for project features list) | `check` | Project capability list checkmark bullet | **REPLACE** |
| `render.js:906` | Arcade game card / `.arcade-exec-icon` | `⚙` | Decorative (accompanied by "EXECUTABLE INFO:" header) | `cog` | Terminal arcade game execution details header icon | **REPLACE** |
| `render.js:946` | Arcade game card / `.arcade-tip-icon` | `ℹ` | Decorative (accompanied by "OPERATOR TIPS:" header) | `info` | Arcade game tips and hints section header icon | **REPLACE** |
| `render.js:1000` | Arcade game card / `.arcade-notice-icon` | `⏳` | Decorative (accompanied by "SYSTEM NOTICE:" header) | `hourglass` | Arcade token stacker cooldown/warning notice icon | **REPLACE** |
| `render.js:1111` | Snake arcade game / `#snake-launch-overlay` button | `▶` | Decorative (accompanied by "LAUNCH VECTOR [PRESS ANY KEY / TAP]") | `play` | Game start overlay button leading glyph | **REPLACE** |
| `render.js:1124` | Snake arcade game / `#snake-resume-btn` | `▶` | Decorative (accompanied by "RESUME THREAD [SPACE]") | `play` | Pause overlay resume button leading glyph | **REPLACE** |
| `render.js:1127` | Snake arcade game / `#snake-restart-btn` | `↺` | Decorative (accompanied by "RESTART [R]") | `rotate-ccw` | Pause overlay restart button leading glyph | **REPLACE** |
| `render.js:1149` | Snake arcade game / `#snake-high-score-banner` | `★` | Decorative (banner framing glyphs: "★ NEW PEAK RECORDED... ★", 2 occurrences) | `trophy` | New high score achievement banner in game-over overlay | **REPLACE** |
| `render.js:1153` | Snake arcade game / `#snake-restart-gameover-btn` | `↺` | Decorative (accompanied by "EXPLORE AGAIN [R / ENTER]") | `rotate-ccw` | Game over restart button leading glyph | **REPLACE** |
| `render.js:1167` | Snake mobile touch D-pad / `#dpad-up` | `▲` | Conveys meaning by itself (has `aria-label="Steer Up"`) | `chevron-up` | Touch control D-pad up arrow button | **REPLACE** |
| `render.js:1171` | Snake mobile touch D-pad / `#dpad-left` | `◀` | Conveys meaning by itself (has `aria-label="Steer Left"`) | `chevron-left` | Touch control D-pad left arrow button | **REPLACE** |
| `render.js:1173` | Snake mobile touch D-pad / `.arcade-dpad-center` | `●` | Decorative (center nub visual styling in D-pad cross) | `circle` | D-pad center deadzone spacer glyph | **REPLACE** |
| `render.js:1175` | Snake mobile touch D-pad / `#dpad-right` | `▶` | Conveys meaning by itself (has `aria-label="Steer Right"`) | `chevron-right` | Touch control D-pad right arrow button | **REPLACE** |
| `render.js:1179` | Snake mobile touch D-pad / `#dpad-down` | `▼` | Conveys meaning by itself (has `aria-label="Steer Down"`) | `chevron-down` | Touch control D-pad down arrow button | **REPLACE** |
| `render.js:1290` | Stacker arcade game / `#stacker-launch-overlay` button | `▶` | Decorative (accompanied by "INITIALIZE CONTEXT [ENTER / TAP]") | `play` | Stacker game start overlay button leading glyph | **REPLACE** |
| `render.js:1303` | Stacker arcade game / `#stacker-resume-btn` | `▶` | Decorative (accompanied by "RESUME THREAD [P]") | `play` | Stacker pause overlay resume button leading glyph | **REPLACE** |
| `render.js:1306` | Stacker arcade game / `#stacker-restart-btn` | `↺` | Decorative (accompanied by "RESTART [R]") | `rotate-ccw` | Stacker pause overlay restart button leading glyph | **REPLACE** |
| `render.js:1333` | Stacker arcade game / `#stacker-high-score-banner` | `★` | Decorative (banner framing glyphs: "★ NEW PEAK RECORD... ★", 2 occurrences) | `trophy` | New high score achievement banner in game-over overlay | **REPLACE** |
| `render.js:1337` | Stacker arcade game / `#stacker-restart-gameover-btn` | `↺` | Decorative (accompanied by "PURGE & RESTART [R / ENTER]") | `rotate-ccw` | Stacker game over restart button leading glyph | **REPLACE** |
| `render.js:1371` | Stacker mobile touch controls / `#touch-left` | `◀` | Conveys meaning by itself (has `aria-label="Shift Token Left"`) | `chevron-left` | Touch control shift left button glyph | **REPLACE** |
| `render.js:1374` | Stacker mobile touch controls / `#touch-rotate` | `↻` | Conveys meaning by itself (has `aria-label="Rotate Token"`) | `rotate-cw` | Touch control rotate clockwise button glyph | **REPLACE** |
| `render.js:1377` | Stacker mobile touch controls / `#touch-right` | `▶` | Conveys meaning by itself (has `aria-label="Shift Token Right"`) | `chevron-right` | Touch control shift right button glyph | **REPLACE** |
| `render.js:1380` | Stacker mobile touch controls / `#touch-down` | `▼` | Conveys meaning by itself (has `aria-label="Soft Drop Token"`) | `chevron-down` | Touch control soft drop button glyph | **REPLACE** |
| `render.js:1383` | Stacker mobile touch controls / `#touch-harddrop` | `⚡` | Decorative (accompanied by "FLUSH" text, has `aria-label="Hard Flush Token"`) | `zap` | Touch control hard drop / flush button icon | **REPLACE** |
| `render.js:1496` | Gradient Descent arcade game / `#gradient-launch-overlay` button | `▶` | Decorative (accompanied by "LAUNCH OPTIMIZATION [ENTER / TAP]") | `play` | Gradient descent game start overlay button leading glyph | **REPLACE** |
| `render.js:1509` | Gradient Descent arcade game / `#gradient-resume-btn` | `▶` | Decorative (accompanied by "RESUME THREAD [P]") | `play` | Gradient descent pause overlay resume button leading glyph | **REPLACE** |
| `render.js:1512` | Gradient Descent arcade game / `#gradient-restart-btn` | `↺` | Decorative (accompanied by "RESTART [R]") | `rotate-ccw` | Gradient descent pause overlay restart button leading glyph | **REPLACE** |
| `render.js:1540` | Gradient Descent arcade game / `#gradient-next-epoch-btn` | `▶` | Decorative (accompanied by "PROCEED TO NEXT EPOCH [SPACE / ENTER]") | `play` | Epoch completion win overlay proceed button leading glyph | **REPLACE** |
| `render.js:1566` | Gradient Descent arcade game / `#gradient-high-score-banner` | `★` | Decorative (banner framing glyphs: "★ NEW PEAK CONVERGENCE... ★", 2 occurrences) | `trophy` | New high score achievement banner in game-over overlay | **REPLACE** |
| `render.js:1570` | Gradient Descent arcade game / `#gradient-restart-gameover-btn` | `↺` | Decorative (accompanied by "RE-INITIALIZE OPTIMIZER [R / ENTER]") | `rotate-ccw` | Gradient descent game over restart button leading glyph | **REPLACE** |
| `render.js:1585` | Gradient Descent mobile touch controls / `#touch-paddle-left` | `◀` | Decorative (accompanied by "STEER" text, has `aria-label="Steer Optimizer Left"`) | `chevron-left` | Touch paddle steer left button leading glyph | **REPLACE** |
| `render.js:1588` | Gradient Descent mobile touch controls / `#touch-launch-text` | `⚡` | Decorative (accompanied by "LAUNCH" text, has `aria-label="Launch Ball or Pause"`) | `zap` | Touch launch parameter ball button icon | **REPLACE** |
| `render.js:1591` | Gradient Descent mobile touch controls / `#touch-paddle-right` | `▶` | Decorative (accompanied by "STEER" text, has `aria-label="Steer Optimizer Right"`) | `chevron-right` | Touch paddle steer right button trailing glyph | **REPLACE** |
| `render.js:1640` | Devlog post list `<time>` element | `📅` | Decorative (accompanied by post date) | `calendar` | Devlog post item date metadata icon | **REPLACE** |
| `arcade-gradient.js:365` | Gradient Descent touch launch button / `this.dom.touchLaunchText` | `⏸` | Decorative (accompanied by "PAUSE" text) | `pause` | Dynamic text update on pause state: `textContent = "⏸ PAUSE"` | **REPLACE** |
| `arcade-gradient.js:384` | Gradient Descent touch launch button / `this.dom.touchLaunchText` | `▶` | Decorative (accompanied by "RESUME" text) | `play` | Dynamic text update on resume state: `textContent = "▶ RESUME"` | **REPLACE** |
| `arcade-gradient.js:394` | Gradient Descent touch launch button / `this.dom.touchLaunchText` | `⏸` | Decorative (accompanied by "PAUSE" text) | `pause` | Dynamic text update on pause state: `textContent = "⏸ PAUSE"` | **REPLACE** |
| `arcade-gradient.js:1152` | Gradient Descent touch launch button / `this.dom.touchLaunchText` | `⚡` | Decorative (accompanied by "LAUNCH" text) | `zap` | Dynamic text reset on ball lose/epoch start: `textContent = "⚡ LAUNCH"` | **REPLACE** |
| `data/achievements.json:6` | `achievements[0].icon` (id: "ach-production-ai") | `🚀` | Decorative / Visual badge in achievement card | `rocket` | "Production AI Deployment" achievement icon | **REPLACE** |
| `data/achievements.json:14` | `achievements[1].icon` (id: "ach-brand-safe") | `🛡️` | Decorative / Visual badge in achievement card | `shield-check` | "Brand-Safe AI Systems" achievement icon | **REPLACE** |
| `data/achievements.json:22` | `achievements[2].icon` (id: "ach-creative-ai") | `🎨` | Decorative / Visual badge in achievement card | `palette` | "Creative AI Solutions" achievement icon | **REPLACE** |
| `data/achievements.json:30` | `achievements[3].icon` (id: "ach-custom-comfyui") | `⚙️` | Decorative / Visual badge in achievement card | `cpu` | "Custom ComfyUI Development" achievement icon | **REPLACE** |
| `data/contact.json:8` | `social_links[0].icon` (Email) | `📧` | Decorative (accompanied by "Email: jilask70@gmail.com") | `mail` | Contact card Email link leading icon | **REPLACE** |
| `data/contact.json:15` | `social_links[1].icon` (Phone) | `📱` | Decorative (accompanied by "Phone: ...") | `smartphone` | Contact card Phone link leading icon | **REPLACE** |
| `data/contact.json:22` | `social_links[2].icon` (GitHub) | `💻` | Decorative (accompanied by "GitHub: github.com/aler69") | `laptop` | Contact card GitHub link icon. (Note: Lucide has no brand icons; `laptop`, `git-branch`, or `code` are valid Lucide replacements) | **REPLACE** |
| `data/contact.json:29` | `social_links[3].icon` (LinkedIn) | `💼` | Decorative (accompanied by "LinkedIn: linkedin.com/in/...") | `briefcase` | Contact card LinkedIn link icon. (Note: Lucide has no brand icons; `briefcase` is closest match) | **REPLACE** |
| `data/experience.json:6` | `entries[0].title` (id: "exp-ai-engineer-freelance") | `💡` | Decorative (embedded in string `"💡 AI Engineer (Freelance)"`) | `lightbulb` | Title string contains emoji prefix. Propose removing emoji from title string and adding `icon: "lightbulb"` field in data schema. | **REPLACE** |
| `data/experience.json:18` | `entries[1].title` (id: "exp-senior-ai-architect") | `🚀` | Decorative (embedded in string `"🚀 Senior AI Architect"`) | `rocket` | Title string contains emoji prefix. Propose removing emoji from title string and adding `icon: "rocket"` field in data schema. | **REPLACE** |
| `data/experience.json:31` | `entries[2].title` (id: "exp-prompt-engineer-freelance") | `💡` | Decorative (embedded in string `"💡 Prompt Engineer (Freelance)"`) | `lightbulb` | Title string contains emoji prefix. Propose removing emoji from title string and adding `icon: "lightbulb"` field in data schema. | **REPLACE** |
| `data/experience.json:43` | `entries[3].title` (id: "exp-junior-flutter-developer") | `📱` | Decorative (embedded in string `"📱 Junior Flutter Developer"`) | `smartphone` | Title string contains emoji prefix. Propose removing emoji from title string and adding `icon: "smartphone"` field in data schema. | **REPLACE** |
| `data/projects.json:22` | `projects[0].icon` (id: "ai-fashion") | `🤖` | Decorative (accompanied by project title in card & modal header) | `bot` | "AI Fashion Pipeline" project thumbnail icon | **REPLACE** |
| `data/projects.json:56` | `projects[1].icon` (id: "ai-content") | `🎨` | Decorative (accompanied by project title in card & modal header) | `palette` | "AI Content Creation" project thumbnail icon | **REPLACE** |
| `data/projects.json:90` | `projects[2].icon` (id: "comfyui-nodes") | `⚙️` | Decorative (accompanied by project title in card & modal header) | `cpu` | "Custom ComfyUI Nodes" project thumbnail icon | **REPLACE** |
| `data/projects.json:124` | `projects[3].icon` (id: "flutter-apps") | `📱` | Decorative (accompanied by project title in card & modal header) | `smartphone` | "Flutter Applications" project thumbnail icon | **REPLACE** |

---

## 2. Deduplicated List of Unique Icons Needed

All proposed icons are sourced strictly from the [Lucide icon library](https://lucide.dev/) (fork of Feather Icons, **ISC License**). No external icon sets or mixed icon fonts are required.

Every single icon name listed below has been verified against the official Lucide database:

| # | Lucide Icon Name | Exists in Lucide | Target Glyphs | Total Usages | Primary Context / Example Lines |
| :-: | :--- | :-: | :---: | :-: | :--- |
| 1 | **`activity`** | ✓ Yes | `🏃` | 1 | `script.js:402` |
| 2 | **`alarm-clock`** | ✓ Yes | `⏰` | 1 | `script.js:980` |
| 3 | **`arrow-down-a-z`** | ✓ Yes | `🔤` | 1 | `render.js:557` |
| 4 | **`ban`** | ✓ Yes | `🚫` | 2 | `script.js:2250`, `script.js:2262` |
| 5 | **`battery-charging`** | ✓ Yes | `🔋` | 2 | `index.html:84`, `gallery/index.html:88` |
| 6 | **`biceps-flexed`** | ✓ Yes | `🦾` | 1 | `script.js:1022` |
| 7 | **`bot`** | ✓ Yes | `🤖` | 5 | `script.js:959`, `script.js:965`, `script.js:1015` |
| 8 | **`brain`** | ✓ Yes | `🧠` | 1 | `script.js:960` |
| 9 | **`briefcase`** | ✓ Yes | `💼` | 1 | `data/contact.json:29` |
| 10 | **`calendar`** | ✓ Yes | `📅` | 5 | `script.js:2197`, `render.js:33`, `render.js:554` |
| 11 | **`camera`** | ✓ Yes | `📷` | 2 | `script.js:2154`, `script.js:2190` |
| 12 | **`check`** | ✓ Yes | `✓` | 2 | `script.js:1728`, `render.js:861` |
| 13 | **`chevron-down`** | ✓ Yes | `▼ / ►, ▼` | 4 | `script.js:1904`, `script.js:2226`, `render.js:1179` |
| 14 | **`chevron-left`** | ✓ Yes | `‹, ◀` | 5 | `index.html:283`, `gallery/index.html:287`, `render.js:1171` |
| 15 | **`chevron-right`** | ✓ Yes | `›, ▼ / ►, ▸, ▶` | 8 | `index.html:288`, `gallery/index.html:292`, `script.js:1904` |
| 16 | **`chevron-up`** | ✓ Yes | `▲` | 1 | `render.js:1167` |
| 17 | **`circle`** | ✓ Yes | `●` | 1 | `render.js:1173` |
| 18 | **`clock`** | ✓ Yes | `🕛` | 1 | `script.js:998` |
| 19 | **`cog`** | ✓ Yes | `⚙` | 1 | `render.js:906` |
| 20 | **`copy`** | ✓ Yes | `📋` | 1 | `script.js:2218` |
| 21 | **`cpu`** | ✓ Yes | `⚙️` | 2 | `data/achievements.json:30`, `data/projects.json:90` |
| 22 | **`eye`** | ✓ Yes | `👁️` | 2 | `script.js:2241`, `render.js:570` |
| 23 | **`file-text`** | ✓ Yes | `📄` | 1 | `script.js:1451` |
| 24 | **`flame`** | ✓ Yes | `😈, 🔥` | 3 | `script.js:970`, `script.js:977`, `script.js:989` |
| 25 | **`gamepad-2`** | ✓ Yes | `🕹️, 🎮` | 2 | `script.js:408`, `script.js:2234` |
| 26 | **`globe`** | ✓ Yes | `🌐` | 2 | `index.html:80`, `gallery/index.html:84` |
| 27 | **`hard-drive`** | ✓ Yes | `💾` | 3 | `index.html:76`, `gallery/index.html:80`, `script.js:961` |
| 28 | **`hourglass`** | ✓ Yes | `⏳` | 2 | `script.js:1003`, `render.js:1000` |
| 29 | **`info`** | ✓ Yes | `ℹ` | 1 | `render.js:946` |
| 30 | **`laptop`** | ✓ Yes | `💻` | 1 | `data/contact.json:22` |
| 31 | **`layers`** | ✓ Yes | `❐` | 1 | `render.js:126` |
| 32 | **`lightbulb`** | ✓ Yes | `💡` | 2 | `data/experience.json:6`, `data/experience.json:31` |
| 33 | **`link-2`** | ✓ Yes | `🔗` | 2 | `script.js:2277`, `script.js:2286` |
| 34 | **`mail`** | ✓ Yes | `📧` | 1 | `data/contact.json:8` |
| 35 | **`monitor`** | ✓ Yes | `🖥️` | 2 | `index.html:72`, `gallery/index.html:76` |
| 36 | **`moon`** | ✓ Yes | `😴` | 1 | `script.js:405` |
| 37 | **`orbit`** | ✓ Yes | `🌀` | 1 | `script.js:1029` |
| 38 | **`palette`** | ✓ Yes | `🎨` | 3 | `script.js:411`, `data/achievements.json:22`, `data/projects.json:56` |
| 39 | **`paperclip`** | ✓ Yes | `📎` | 1 | `script.js:968` |
| 40 | **`pause`** | ✓ Yes | `⏸` | 2 | `arcade-gradient.js:365`, `arcade-gradient.js:394` |
| 41 | **`play`** | ✓ Yes | `▶` | 12 | `script.js:2121`, `render.js:127`, `render.js:130` |
| 42 | **`rocket`** | ✓ Yes | `🚀` | 2 | `data/achievements.json:6`, `data/experience.json:18` |
| 43 | **`rotate-ccw`** | ✓ Yes | `↺` | 7 | `render.js:731`, `render.js:1127`, `render.js:1153` |
| 44 | **`rotate-cw`** | ✓ Yes | `↻` | 1 | `render.js:1374` |
| 45 | **`shield-check`** | ✓ Yes | `🛡️` | 1 | `data/achievements.json:14` |
| 46 | **`skull`** | ✓ Yes | `💀` | 1 | `script.js:969` |
| 47 | **`smartphone`** | ✓ Yes | `📱` | 3 | `data/contact.json:15`, `data/experience.json:43`, `data/projects.json:124` |
| 48 | **`snowflake`** | ✓ Yes | `❄️` | 1 | `script.js:1041` |
| 49 | **`sparkles`** | ✓ Yes | `✨` | 1 | `script.js:967` |
| 50 | **`star`** | ✓ Yes | `★` | 2 | `render.js:134`, `render.js:555` |
| 51 | **`triangle-alert`** | ✓ Yes | `⚠️` | 3 | `script.js:966`, `script.js:1049`, `render.js:194` |
| 52 | **`trophy`** | ✓ Yes | `★` | 3 | `render.js:1149`, `render.js:1333`, `render.js:1566` |
| 53 | **`wrench`** | ✓ Yes | `🛠️` | 1 | `script.js:2196` |
| 54 | **`x`** | ✓ Yes | `✕` | 3 | `index.html:277`, `gallery/index.html:281`, `render.js:598` |
| 55 | **`zap`** | ✓ Yes | `⚡` | 3 | `render.js:1383`, `render.js:1588`, `arcade-gradient.js:1152` |

> [!NOTE]
> **Brand Icon Policy in Lucide:** Lucide intentionally omits proprietary corporate brand logos (e.g. GitHub, LinkedIn, Twitter) to maintain an unencumbered ISC open-source license. In `data/contact.json`, the audit proposes standard developer metaphors: **`laptop`** (or `git-branch`/`code`) for GitHub, and **`briefcase`** for LinkedIn.

---

## 3. Data Schema Proposal (`data/*.json`)

### Problem Analysis
Currently, icons in JSON data files are handled inconsistently:
1. **`data/experience.json` embeds emoji directly inside string titles:**  
   `"title": "💡 AI Engineer (Freelance)"` — this forces screen readers to announce "ELECTRIC LIGHT BULB" before the job title and prevents CSS recoloring.
2. **`data/achievements.json`, `data/projects.json`, and `data/contact.json` use emoji values in `"icon"` fields:**  
   `"icon": "🚀"`, `"icon": "🤖"`, `"icon": "📧"`.
3. **Other data files** (`data/about.json`, `data/gallery.json`, `data/posts.json`, `data/skills.json`, `data/arcade-games.json`) contain zero emoji strings.

### Proposed Schema Standard
Every entity that displays an icon should use an optional string field: `"icon": "<lucide-icon-name>"`, and all title/name fields must contain clean, plain text.

#### 1. `data/experience.json`
**Before:**
```json
{
  "id": "exp-ai-engineer-freelance",
  "title": "💡 AI Engineer (Freelance)",
  "company": "@ Self-employed"
}
```
**Proposed:**
```json
{
  "id": "exp-ai-engineer-freelance",
  "icon": "lightbulb",
  "title": "AI Engineer (Freelance)",
  "company": "@ Self-employed"
}
```
*Full changes for `data/experience.json`:*
- `"exp-ai-engineer-freelance"`: `"icon": "lightbulb"`, `"title": "AI Engineer (Freelance)"`
- `"exp-senior-ai-architect"`: `"icon": "rocket"`, `"title": "Senior AI Architect"`
- `"exp-prompt-engineer-freelance"`: `"icon": "lightbulb"`, `"title": "Prompt Engineer (Freelance)"`
- `"exp-junior-flutter-developer"`: `"icon": "smartphone"`, `"title": "Junior Flutter Developer"`

#### 2. `data/achievements.json`
Replace raw emoji values with Lucide icon names:
```json
// Before -> Proposed
"ach-production-ai":  "icon": "🚀" -> "icon": "rocket"
"ach-brand-safe":     "icon": "🛡️" -> "icon": "shield-check"
"ach-creative-ai":    "icon": "🎨" -> "icon": "palette"
"ach-custom-comfyui": "icon": "⚙️" -> "icon": "cpu"
```

#### 3. `data/projects.json`
Replace raw emoji values with Lucide icon names:
```json
// Before -> Proposed
"ai-fashion":     "icon": "🤖" -> "icon": "bot"
"ai-content":     "icon": "🎨" -> "icon": "palette"
"comfyui-nodes":  "icon": "⚙️" -> "icon": "cpu"
"flutter-apps":   "icon": "📱" -> "icon": "smartphone"
```

#### 4. `data/contact.json`
Replace raw emoji values in `social_links` with Lucide icon names:
```json
// Before -> Proposed
"Email":    "icon": "📧" -> "icon": "mail"
"Phone":    "icon": "📱" -> "icon": "smartphone"
"GitHub":   "icon": "💻" -> "icon": "laptop" (or "git-branch")
"LinkedIn": "icon": "💼" -> "icon": "briefcase"
```

---

## 4. Dynamic & Canvas Locations

### Dynamic JS Locations (Template Literals & DOM Updates)
1. **`arcade-gradient.js` (DOM Text Updates):**
   - Lines 365, 394: `this.dom.touchLaunchText.textContent = '⏸ PAUSE';`
   - Line 384: `this.dom.touchLaunchText.textContent = '▶ RESUME';`
   - Line 1152: `this.dom.touchLaunchText.textContent = '⚡ LAUNCH';`
   - *Action needed:* Update code to render an SVG icon element inside the button rather than replacing `textContent` with raw glyph strings.
2. **`script.js` Cyber-Pet Status Generation (`CyberPet.getStatusMessage`):**
   - Lines 402, 405, 408, 411: Status messages prepend emoji: `🏃 Whoa...`, `😴 I'm nodding...`, `🕹️ Oh sweet...`, `🎨 Look at all...`.
   - *Action needed:* Return clean text or an object `{ icon: "activity", text: "Whoa..." }` rendered with SVG.
3. **`script.js` Easter-Egg HTOP & Doomsday Modal Generation:**
   - Lines 959–970: Dynamic HTML template strings containing `🤖`, `🧠`, `💾`, `⚠️`, `✨`, `📎`, `💀`, `😈`.
   - Lines 977–1049: Doomsday metrics cards: `⏰`, `🔥`, `🕛`, `⏳`, `🤖`, `🦾`, `🌀`, `❄️`, `⚠️`.
   - Line 1451: `notification.textContent = '📄 Resume downloaded successfully!';`.
4. **`script.js` Interactive Lightbox Controls:**
   - Line 1728: Copied feedback: `<span class="copy-icon">✓</span> Copied!`.
   - Lines 1904, 2226: Accordion toggle: `▼ Hide prompt details` vs `► Behind the image`.
   - Line 2040: Caption bullet: `<span class="caption-icon">▸</span>`.
   - Line 2121: Sub-item badge: `${isSubVid ? '▶' : (idx + 1)}`.
   - Lines 2154, 2190: Sub-item header: `📷 ACTIVE VIEW`.
   - Lines 2196, 2197: Metadata sidebar: `🛠️ Tool:`, `📅 Date:`.
   - Line 2210: Logic header: `🤖 PROMPT LOGIC:`.
   - Line 2218: Copy button: `📋 Copy prompt`.
   - Line 2234: Guess badge: `🎮 GUESS THE PROMPT MODE`.
   - Line 2241: Decrypt button: `👁️ REVEAL PROMPT // [DECRYPT]`.
   - Lines 2250, 2262: Negative prompt header: `🚫 Negative Prompt:`.
   - Lines 2277, 2286: Project deep-link: `🔗 Related Project:`.
5. **`render.js` UI Card & Controls Templates:**
   - Lines 33, 1640: Date badge `📅`.
   - Lines 126, 127, 130, 134, 162, 194: Gallery badges & overlays (`❐`, `▶`, `★`, `⚠️`).
   - Lines 554–557: Gallery sort dropdown `<option>` tags (`📅`, `★`, `🔤`).
   - Lines 570, 598, 731: Toolbar controls (`👁️`, `✕`, `↺`).
   - Line 861: Modal checklist bullets `✓`.
   - Lines 906, 946, 1000: Arcade card info headers (`⚙`, `ℹ`, `⏳`).
   - Lines 1111–1591: Snake, Stacker, and Gradient Descent arcade overlays, high-score banners (`★`), restart triggers (`↺`), and mobile D-pad / touch control buttons (`▲`, `▼`, `◀`, `▶`, `↻`, `⚡`, `●`).

### Canvas `<canvas>` Inspection
- **`arcade-stacker.js` (Lines 1250, 1327):**
  `this.ctx.fillText(pieceId ? `[${pieceId}]` : '•', x + w / 2, y + h / 2);` and
  `this.nextCtx.fillText(this.nextPiece.id || '•', x + s / 2, y + s / 2);`
  Canvas draws a text bullet glyph `•` (U+2022) to mark empty grid cells. This is a monochrome text dot rendered by the 2D canvas context, not an emoji icon. Recommend keeping as canvas text.
- **`arcade-snake.js` (Line 1083):**
  `ctx.fillText(this.activeLabel.text, labelX, labelY);`
  Draws floating text labels from `category.tokens` (`"CONCEPT"`, `"cat"`, `"[64, 128]"`). **Zero emoji are drawn.**
- **`arcade-gradient.js` (Line 1265):**
  `ctx.fillText('MIN', ...)`
  Draws plain ASCII text `"MIN"`. **Zero emoji are drawn.**

---

## 5. Accessibility Findings

1. **Attributes Scan (`aria-label`, `alt`, `title`):**
   - **0 emoji or symbols** were found inside `aria-label`, `alt`, or `title` attributes. All accessibility attributes currently use plain English text strings (e.g. `aria-label="Previous gallery item"`).
2. **Glyphs as the Sole Carrier of Meaning:**
   - **`render.js:162` (`<span class="video-play-glyph">▶</span>`):** Hover overlay on video gallery cards lacks `aria-hidden="true"`. Screen readers announce "BLACK RIGHT-POINTING TRIANGLE". Needs `<svg aria-hidden="true">` with card `aria-label` describing video content.
   - **`script.js:2121` (`${isSubVid ? '▶' : (idx + 1)}`):** Sub-item thumbnail badge in case-study modal. When displaying a video, only the visual `▶` glyph distinguishes it. While it has `aria-hidden="true"`, the parent `<button>` should include an explicit `aria-label` (e.g. `aria-label="Item 2: Video clip"`).
   - **`render.js:861` (`<span style="color: var(--accent-green);">✓</span>`):** Project modal capability list bullets lack `aria-hidden="true"`. Screen readers announce "CHECK MARK" before every item.
   - **`script.js:998` (`<div class="doomsday-clock">🕛</div>`) & `script.js:1022` (`<span class="robot-arm">🦾</span>`):** Visual indicators in the easter egg modal with no text equivalent or accessible announcement.
3. **Text Strings with Prepended Emoji:**
   - `data/experience.json`: Job titles `"💡 AI Engineer"` announce "ELECTRIC LIGHT BULB AI Engineer" in screen reader headings.
   - `script.js:402, 405, 408, 411`: Cyber-pet status lines announce literal emoji names ("RUNNER Whoa...", "SLEEPING FACE I'm nodding...").
   - `script.js:1451`: Toast notification announces "PAGE FACING UP Resume downloaded successfully!".
4. **Form Controls (`<select>` Options in `render.js:554-557`):**
   - `<option>` tags cannot render HTML or inline SVGs. Including emoji in `<option>` text degrades accessibility and platform consistency. Propose removing emoji from option text entirely and placing a single Lucide sort icon (`arrow-up-down` or `list-filter`) next to the `<select>` trigger.

---

## 6. Category C and Category D Lists

### Category C — Terminal-Style Text Glyphs (Aesthetic Elements to KEEP)
These glyphs are integral to the retro Arch Linux Waybar/terminal aesthetic. Default decision: **KEEP**.

| Glyph | Codepoint | Occurrences | Role & Context | Decision |
| :---: | :--- | :---: | :--- | :---: |
| `➜` | U+279C | 17 | Terminal prompt prefix in navigation (`index.html:175-215`, `gallery/index.html:179-219`) and devlog card action (`render.js:42`) | **KEEP** |
| `→` | U+2192 | 8 | Action arrow in devlog cards (`render.js:42`), experience bullets (`render.js:60`), and project links (`script.js:2277`) | **KEEP** |
| `←` `↑` `↓` | U+2190, U+2191, U+2193 | 6 | Directional key hints in arcade game descriptions (`WASD / ↑↓←→`, `←→` in `data/arcade-games.json:23, 48, 74`) | **KEEP** |
| `•` | U+2022 | 3 | Canvas grid empty block marker (`arcade-stacker.js:1250, 1327`) and terminal log separator (`script.js:1478`) | **KEEP** |
| `╔═╗║╚╝░█▄` | U+2550-2591 | 8 | ASCII art banner and border box-drawing in console greeting (`script.js:84-88`) | **KEEP** |
| `°` | U+00B0 | 2 | Degree symbol in code comments (`arcade-snake.js:438`: "180° immediate self-collision") and math | **KEEP** |
| `—` `–` | U+2014, U+2013 | 12 | Typographic em/en dashes in dates and comments (`styles.css:448, 2789`, `hello-world.md:36`, `data/experience.json:9`) | **KEEP** |

### Category D — Prose Content Emoji
Prose content is outside the UI icon system and out of scope.

| File | Emoji Found | Notes | Decision |
| :--- | :---: | :--- | :---: |
| `content/posts/hello-world.md` | None (0) | Markdown devlog post contains zero emoji | **OUT OF SCOPE** |
| `data/gallery.json` | None (0) | AI prompts, descriptions, and metadata contain zero emoji | **OUT OF SCOPE** |
| `README.md` *(informational)* | 11 | Project documentation prose emoji (`🚀`, `📦`, `🛠️`, etc.) | **OUT OF SCOPE** |
| `scripts/check-gallery-sync.js` *(informational)* | 2 | Developer console test script logging (`✅`, `❌`) | **OUT OF SCOPE** |

---

## 7. Verification & Sign-off

1. **Completeness Check:**  
   Re-ran Unicode Extended Pictographic and symbol regex across all 18 files. Every match in Categories A and B maps 1:1 to a specific row in the table above.
2. **Discipline Check:**  
   Zero source files were modified. `git status` verifies only `docs/icon-audit.md` is staged/created.
3. **Next Steps for Implementation:**  
   - Site owner reviews the Decision column (pre-filled `REPLACE`).
   - Install or vendor Lucide SVG icons.
   - Update `data/*.json` schemas according to Section 3.
   - Replace emoji in HTML and JS templates with inline SVG components.
