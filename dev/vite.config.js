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
            name: 'copy-static-data-and-assets',
            closeBundle() {
                if (fs.existsSync('data')) {
                    fs.cpSync('data', 'dist/data', { recursive: true });
                }
                if (fs.existsSync('assets')) {
                    fs.cpSync('assets', 'dist/assets', { recursive: true });
                }
            }
        }
    ]
});
