# Building in the Terminal: Introducing the Devlog

Welcome to my personal engineering journal and devlog, integrated directly into this retro Arch Linux tiling window manager environment.

This devlog provides a behind-the-scenes look at my experiments in **Generative AI**, **ComfyUI custom pipelines**, prompt architecture, and systems engineering.

## Architecture Highlights

Rather than relying on heavy server-side static site generators or bundlers, this devlog uses a pure client-side pipeline:

- **Zero-build delivery**: Markdown files are hosted as raw static assets and parsed client-side using `marked.js` loaded via CDN.
- **Manifest-driven index**: A lightweight `data/posts.json` array serves as the single source of truth for routing, metadata, and tags.
- **Terminal aesthetic**: All rendered typography, code listings, and blockquotes adhere strictly to the Eva Green and cybernetic terminal palette.

### Dynamic Pipeline Flow

Here is a quick look at how markdown posts are resolved dynamically at runtime:

```javascript
async function loadPostContent(markdownPath) {
    const response = await fetch(markdownPath);
    if (!response.ok) {
        throw new Error(`Failed to load devlog post: ${response.status}`);
    }
    const markdownText = await response.text();
    return window.marked.parse(markdownText);
}
```

## Core Design Principles

1. **Lightweight & Fast**: Instant loading without blocking main thread executions.
2. **Accessible by Default**: Fully keyboard-navigable via tab indexes and semantic HTML elements.
3. **Responsive on Any Screen**: Monospace-styled layouts that scale down cleanly to 375px mobile viewports.

> "Simplicity is prerequisite for reliability." — Edsger W. Dijkstra

Stay tuned for deep-dives into custom ComfyUI nodes, LoRA model fine-tuning, and neural workflow optimizations!
