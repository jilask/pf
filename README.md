# 🖥️ Retro Tiling WM Portfolio

An interactive, cyberpunk-inspired developer portfolio styled like an **Arch Linux Tiling Window Manager** (Waybar + Hyprland aesthetic). Designed for **AliJ A. Shaikh** — Senior AI Architect & Prompt Engineer.

![Retro Tiling WM UI Screenshot](file:///C:/Users/alijs/.gemini/antigravity-ide/brain/fc7f0c59-3d08-4fff-814b-1a5b70e8a715/portfolio_preview_1785764616261.png)

---

## 🌟 Overview & Key Features

This portfolio reimagines a traditional personal website into a fully functional retro Linux desktop environment inside the browser.

- **📊 Top Waybar Status Line**: Displays workspace switches (1–5), live system clock/date, and real-time simulated system telemetry (CPU %, RAM consumption, WiFi status, Battery level).
- **🪟 Tiling Window Manager Layout**:
  - **ASCII Visualization (`SYSTEM-01`)**: Live animated ASCII face expression box.
  - **Process Monitor (`KERNEL CORE`)**: `htop`-inspired real-time process monitor with CPU/Memory usage bars.
  - **Main Terminal (`USER@SYSTEM: ~/portfolio`)**: Interactive prompt (`alij@portfolio:~/portfolio$`) rendering dynamic portfolio sections with smooth typewriter effects.
  - **Navigation Terminal (`zsh`)**: Quick shell command links (`cat about.md`, `cat skills.json`, `cat experience.log`, `cat achievements.txt`, `ls -la projects/`, `contact --info`).
  - **Neural Metrics (`LINK-STATUS`)**: Live sparkline telemetry and neural link network status graphs.
- **🎨 Retro Terminal Aesthetics**: CRT/Linux terminal aesthetic using monospaced fonts (`Share Tech Mono`, `JetBrains Mono`, `Fira Code`), neon accents, glowing scrollbars, and tiling window controls.

---

## 🛠️ Tech Stack

- **Core**: HTML5, CSS3, JavaScript (ES6+ Vanilla OOP)
- **Typography**: Google Fonts ([Share Tech Mono](https://fonts.google.com/specimen/Share+Tech+Mono), [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono), [Fira Code](https://fonts.google.com/specimen/Fira+Code))
- **Build & Tooling**: [Vite](https://vitejs.dev/), [ESLint](https://eslint.org/)

---

## 🚀 Quick Start & Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` (comes bundled with Node.js)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jilask/pf.git
   cd pf
   ```

2. **Install dependencies** (optional for dev tools):
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:5173` (or the URL printed in your terminal).

---

## 📜 Available NPM Scripts

In the project directory, you can run:

| Command | Action |
|---|---|
| `npm run dev` | Runs the app in development mode using Vite with HMR. |
| `npm run build` | Bundles and optimizes the app for production in the `dist/` directory. |
| `npm run preview` | Runs a local web server to preview the production build. |
| `npm run lint` | Runs ESLint to inspect code for syntax and style issues. |

---

## 📦 Build & Deployment

### Build for Production

```bash
npm run build
```

This compiles all assets into the `dist/` directory.

### Deployment Options

- **GitHub Pages**: Deploy static root files or configure GitHub Actions to deploy the `dist/` folder on `main` branch push.
- **Vercel / Netlify / Cloudflare Pages**: Connect the repository and set the build command to `npm run build` and publish directory to `dist`.

---

## 🗺️ Roadmap & Future Enhancements

- [ ] **Interactive CLI Input**: Full command-line interface parsing arbitrary user commands (`help`, `clear`, `sudo`, `fetch`).
- [ ] **Theme Engine**: Support for popular Linux color schemes (Nord, Gruvbox, Dracula, Tokyo Night, Solarized Dark).
- [ ] **Tiling Window Physics**: Interactive drag-and-drop window resizing and floating/tiling toggles.
- [ ] **Live GitHub API Integration**: Auto-populate project cards directly from GitHub repositories.
- [ ] **Audio FX**: Toggleable key click sounds and terminal bell chime.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
