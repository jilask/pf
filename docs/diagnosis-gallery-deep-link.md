# Diagnosis: Broken `/gallery/` Deep Link (`/pf/gallery/`)

**Date:** 2026-09-24  
**Branch:** `content/devlog-core`  
**Issue:** `/pf/gallery/` (served from `gallery/index.html`) is completely broken on live GitHub Pages / preview environments.

---

## 1. Live Environment & Console Diagnosis

When navigating to the live URL `https://jilask.github.io/pf/gallery/`:
- The browser encounters multiple 404 (Not Found) network errors:
  - `GET https://jilask.github.io/styles.css` -> `HTTP/2 404 Not Found`
  - `GET https://jilask.github.io/render.js` -> `HTTP/2 404 Not Found`
  - `GET https://jilask.github.io/arcade-snake.js` -> `HTTP/2 404 Not Found`
  - `GET https://jilask.github.io/script.js` -> `HTTP/2 404 Not Found`
- Browser console error:
  - `Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.`
  - `GET https://jilask.github.io/styles.css net::ERR_ABORTED 404 (Not Found)`
- Visible result:
  - Completely unstyled HTML skeleton.
  - Zero JavaScript execution (event listeners, dynamic rendering, data loading, workspace switching, and auto-open router never fire).

### Root Cause of the 404 Errors
In commit `478700ec2cb69ec2e20719f5db93729635a62348` (`feat(arcade): implement interactive terminal snake game...`), the script and stylesheet references in `gallery/index.html` were modified with leading root slashes (`/`):
```html
<link rel="stylesheet" href="/styles.css">
...
<script type="module" src="/render.js"></script>
<script type="module" src="/arcade-snake.js"></script>
<script type="module" src="/script.js"></script>
```
Because GitHub Pages hosts the repository under the subpath `/pf/` (`https://jilask.github.io/pf/`), any path beginning with `/` is evaluated as domain-relative (`https://jilask.github.io/`), bypassing the `<base href="../">` tag. In contrast, relative paths (e.g. `styles.css`, `render.js`) correctly resolve through `<base href="../">` to `https://jilask.github.io/pf/...`.

---

## 2. Structural Diff Between `index.html` and `gallery/index.html`

A full diff between `index.html` and `gallery/index.html` reveals the following:

### A. Intentional Deep-Link Differences (Should Be Preserved)
1. `<base href="../">` in `<head>`: Required so relative asset and data paths resolve to root `/pf/` from `/pf/gallery/`.
2. Title & SEO Meta Tags:
   - `<title>AliJ A. Shaikh - AI Art & Motion Gallery</title>`
   - Meta description and keywords tailored for the Art & Motion Gallery.
   - Canonical URL pointing to `https://jilask.github.io/pf/gallery/`.
3. Open Graph & Twitter Cards:
   - `og:url`, `og:title`, `og:description`, `twitter:url`, `twitter:title`, `twitter:description` targeting the gallery deep link.
4. Auto-open trigger:
   - Inline script `<script>window.__initialPane = 'gallery';</script>`
   - Attribute `<body data-open-pane="gallery">`

### B. Unintentional Drift & Structural Discrepancies (To Be Fixed)
1. **Leading Slashes on Asset Links (Critical Bug)**:
   - `gallery/index.html` uses `/styles.css`, `/render.js`, `/arcade-snake.js`, `/script.js`.
   - Must be changed to relative: `styles.css`, `render.js`, `arcade-snake.js`, `script.js`.
2. **Missing Arcade Game Scripts (Parity Bug)**:
   - Recent Arcade PRs added new module scripts to `index.html`, but they were never added to `gallery/index.html`:
     - `<script type="module" src="arcade-stacker.js"></script>` (PR #27 / Token Stacker)
     - `<script type="module" src="arcade-gradient.js"></script>` (PR #28 / Gradient Descent)
   - When a user on `/gallery/` navigates to Workspace 5 (Arcade), Token Stacker and Gradient Descent cannot load or execute.
3. **Accessibility Drift in `#arcade-window`**:
   - `index.html`:
     `<button class="control close" type="button" aria-label="Close arcade and return to workspace 1" tabindex="0"></button>`
   - `gallery/index.html`:
     `<button class="control close" type="button" aria-label="Close window" tabindex="-1"></button>`
   - In `gallery/index.html`, the close button is unreachable by keyboard navigation (`tabindex="-1"`) and lacks the descriptive accessible label.
4. **Line Terminators**:
   - `index.html` has CRLF (`\r\n`) line terminators while `gallery/index.html` has LF (`\n`). Normalizing avoids spurious diff noise.

### C. Already Synced Components (Verified OK)
- **AI Core Expansion**: `#ascii-animation` button, `aria-label="Interactive ASCII friend. Press Enter or Space to say hello."`, and `.ascii-status` with `aria-live="polite"` match in both files.
- **Devlog Feature**: Nav tab button `cat devlog.md` (`data-command="devlog"`) and CDN script `https://cdnjs.cloudflare.com/ajax/libs/marked/12.0.2/marked.min.js` are present in both files.
- **Gallery Lightbox**: Complete `#gallery-lightbox` modal and subnav structure matches in both files.

---

## 3. Remedy Plan

1. Reconcile `gallery/index.html`:
   - Strip leading slashes from stylesheet and script tags.
   - Add missing `arcade-stacker.js` and `arcade-gradient.js` script tags.
   - Synchronize `#arcade-window` close button attributes.
2. Verify:
   - Test static serving of `/` and `/gallery/`.
   - Test `npm run dev` and `npm run build && npm run preview`.
   - Test responsive layout down to 375px.
3. Future Safeguards:
   - Provide a verification script (`scripts/check-gallery-sync.js`) that automatically checks structural parity between `index.html` and `gallery/index.html`.
