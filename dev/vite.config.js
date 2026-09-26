import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                gallery: resolve(__dirname, 'gallery/index.html')
            }
        }
    },
    plugins: [
        {
            name: 'resolve-gallery-base-assets',
            resolveId(id) {
                if (['render.js', 'arcade-snake.js', 'arcade-stacker.js', 'arcade-gradient.js', 'script.js'].includes(id)) {
                    return resolve(__dirname, id);
                }
                return null;
            },
            transformIndexHtml: {
                order: 'pre',
                handler(html, ctx) {
                    const isGallery = (ctx.path && ctx.path.includes('gallery')) || 
                                      (ctx.filename && ctx.filename.includes('gallery'));
                    if (isGallery) {
                        return html
                            .replace('href="styles.css"', 'href="/styles.css"')
                            .replace(/src="(render\.js|arcade-[a-z]+\.js|script\.js)"/g, 'src="/$1"');
                    }
                    return html;
                }
            }
        },
        {
            name: 'copy-static-data-and-assets',
            closeBundle() {
                if (fs.existsSync('data')) {
                    fs.cpSync('data', 'dist/data', { recursive: true });
                }
                if (fs.existsSync('assets')) {
                    fs.cpSync('assets', 'dist/assets', { recursive: true });
                }
                if (fs.existsSync('content')) {
                    fs.cpSync('content', 'dist/content', { recursive: true });
                }
            }
        }
    ]
});
