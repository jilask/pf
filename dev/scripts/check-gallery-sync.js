#!/usr/bin/env node

/**
 * check-gallery-sync.js
 *
 * Automated verification script to detect drift between index.html and gallery/index.html.
 * Ensures all shared navigation items, window panes, script tags, and stylesheets remain
 * synchronized across features, while enforcing correct relative paths and deep-link differences.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const indexPath = path.join(rootDir, 'index.html');
const galleryPath = path.join(rootDir, 'gallery/index.html');

if (!fs.existsSync(indexPath) || !fs.existsSync(galleryPath)) {
    console.error('Error: index.html or gallery/index.html not found.');
    process.exit(1);
}

const normalize = (str) => str.replace(/\r\n/g, '\n').trim();

const indexHtml = normalize(fs.readFileSync(indexPath, 'utf-8'));
const galleryHtml = normalize(fs.readFileSync(galleryPath, 'utf-8'));

const errors = [];

// 1. Verify Intentional Deep-Link Elements in gallery/index.html
if (!galleryHtml.includes('<base href="../">')) {
    errors.push('gallery/index.html must include <base href="../"> in <head>.');
}
if (!galleryHtml.includes("window.__initialPane = 'gallery';")) {
    errors.push('gallery/index.html must include window.__initialPane = \'gallery\'; script.');
}
if (!galleryHtml.includes('data-open-pane="gallery"')) {
    errors.push('gallery/index.html must include data-open-pane="gallery" on <body>.');
}

// 2. Disallow leading slashes on assets in gallery/index.html (breaks GitHub Pages /pf/ base)
if (galleryHtml.includes('href="/styles.css"')) {
    errors.push('gallery/index.html has href="/styles.css". Must be relative "styles.css" to work with <base href="../">.');
}
const leadingSlashScriptMatches = galleryHtml.match(/src="\/(render|arcade|script)[^"]*"/g);
if (leadingSlashScriptMatches) {
    errors.push(`gallery/index.html has root-relative script sources: ${leadingSlashScriptMatches.join(', ')}. Use relative paths without leading slash.`);
}

// 3. Verify all script tags in index.html exist in gallery/index.html
const extractScripts = (html) => {
    const regex = /<script\b[^>]*src="([^"]+)"[^>]*><\/script>/g;
    const scripts = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
        scripts.push(match[1]);
    }
    return scripts;
};

const indexScripts = extractScripts(indexHtml);
const galleryScripts = extractScripts(galleryHtml);

indexScripts.forEach((script) => {
    if (!galleryScripts.includes(script)) {
        errors.push(`gallery/index.html is missing script: src="${script}" (present in index.html).`);
    }
});

// 4. Verify all navigation items match
const extractNavCommands = (html) => {
    const regex = /data-command="([a-zA-Z0-9_-]+)"/g;
    const commands = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
        commands.push(match[1]);
    }
    return commands;
};

const indexNav = extractNavCommands(indexHtml);
const galleryNav = extractNavCommands(galleryHtml);

indexNav.forEach((cmd) => {
    if (!galleryNav.includes(cmd)) {
        errors.push(`gallery/index.html is missing navigation command: data-command="${cmd}".`);
    }
});

// 5. Verify essential container panes exist in gallery/index.html
const essentialElements = [
    'id="waybar"',
    'id="desktop"',
    'id="window-grid"',
    'id="ascii-viz"',
    'id="ascii-animation"',
    'id="system-monitor"',
    'id="portfolio-window"',
    'id="portfolio-content"',
    'id="nav-terminal"',
    'id="system-metrics"',
    'id="arcade-window"',
    'id="arcade-content"',
    'id="gallery-lightbox"'
];

essentialElements.forEach((el) => {
    if (!galleryHtml.includes(el)) {
        errors.push(`gallery/index.html is missing element: ${el}.`);
    }
});

// 6. Verify Arcade Close Button accessibility attributes
if (!galleryHtml.includes('aria-label="Close arcade and return to workspace 1" tabindex="0"')) {
    errors.push('gallery/index.html has outdated arcade close button attributes.');
}

if (errors.length > 0) {
    console.error('❌ Parity check failed! The following discrepancies were found:');
    errors.forEach((err, idx) => console.error(`  ${idx + 1}. ${err}`));
    process.exit(1);
} else {
    console.log('✅ Parity check passed: gallery/index.html is in sync with index.html!');
    process.exit(0);
}
