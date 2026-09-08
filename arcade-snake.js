/**
 * ArcadeSnakeGame - Retro Terminal HTML5 Canvas Snake Game Engine
 * Workspace 5 Arcade - AliJ Portfolio
 */
class ArcadeSnakeGame {
    constructor(options = {}) {
        this.canvas = document.getElementById('snake-canvas');
        if (!this.canvas) {
            console.error('ArcadeSnakeGame: #snake-canvas element not found.');
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        this.onReturnToMenu = options.onReturnToMenu || (() => {});
        this.gridSize = 20; // 20x20 grid
        this.canvasSize = 400; // 400x400 virtual pixels
        this.cellSize = this.canvasSize / this.gridSize; // 20px per cell
        this.storageKey = 'arcade-snake-highscore';
        this.tickSpeed = 105; // ms per game tick (~9.5 Hz)

        // Game state variables
        this.state = 'START'; // 'START' | 'PLAYING' | 'PAUSED' | 'GAMEOVER'
        this.snake = [];
        this.dir = { x: 1, y: 0 };
        this.nextDir = { x: 1, y: 0 };
        this.food = { x: 15, y: 10 };
        this.score = 0;
        this.highScore = this.loadHighScore();
        this.gameInterval = null;
        this.eatEffectTimer = 0;
        this.audioCtx = null;
        this.hasNewRecord = false;

        // Swipe tracking
        this.touchStartX = 0;
        this.touchStartY = 0;

        // Bound event handler references for clean removal
        this.boundKeyHandler = this.handleKeyDown.bind(this);
        this.boundTouchStart = this.handleCanvasTouchStart.bind(this);
        this.boundTouchMove = this.handleCanvasTouchMove.bind(this);
        this.boundTouchEnd = this.handleCanvasTouchEnd.bind(this);
        this.boundRenderLoop = this.renderLoop.bind(this);
        this.animFrameId = null;

        this.initDOM();
        this.bindEvents();
        this.resetGameData();
        this.setupDPI();
        this.startRenderLoop();
    }

    /**
     * Set up Canvas for High-DPI displays (Retina/4K)
     */
    setupDPI() {
        if (!this.canvas || !this.ctx) return;
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.canvasSize * dpr;
        this.canvas.height = this.canvasSize * dpr;
        this.ctx.resetTransform?.();
        this.ctx.scale(dpr, dpr);
    }

    /**
     * Cache DOM element references
     */
    initDOM() {
        this.elements = {
            scoreDisplay: document.getElementById('snake-score-display'),
            highScoreDisplay: document.getElementById('snake-highscore-display'),
            lengthDisplay: document.getElementById('snake-length-display'),
            statusText: document.getElementById('snake-status-text'),
            announcer: document.getElementById('snake-live-announcer'),
            startOverlay: document.getElementById('snake-start-overlay'),
            pauseOverlay: document.getElementById('snake-pause-overlay'),
            gameOverOverlay: document.getElementById('snake-gameover-overlay'),
            gameOverTag: document.getElementById('snake-gameover-tag'),
            finalScore: document.getElementById('snake-final-score'),
            gameOverBest: document.getElementById('snake-gameover-best'),
            newHighScoreBadge: document.getElementById('snake-new-highscore-badge'),
            pauseBtn: document.getElementById('snake-pause-btn'),
            pauseBtnText: document.getElementById('snake-pause-btn-text'),
            startBtn: document.getElementById('snake-start-btn'),
            resumeBtn: document.getElementById('snake-resume-btn'),
            restartBtn: document.getElementById('snake-restart-btn'),
            restartHudBtn: document.getElementById('snake-restart-hud-btn'),
            restartFromPauseBtn: document.getElementById('snake-restart-from-pause-btn'),
            exitToMenuBtn: document.getElementById('snake-exit-to-menu-btn'),
            backToMenuBtn: document.getElementById('arcade-back-to-menu-btn'),
            // D-Pad buttons
            dpadUp: document.getElementById('dpad-up'),
            dpadDown: document.getElementById('dpad-down'),
            dpadLeft: document.getElementById('dpad-left'),
            dpadRight: document.getElementById('dpad-right')
        };

        this.updateHUD();
    }

    /**
     * Load persisted high score from localStorage
     */
    loadHighScore() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            const val = parseInt(saved, 10);
            return isNaN(val) || val < 0 ? 0 : val;
        } catch (e) {
            console.warn('Unable to access localStorage for arcade high score:', e);
            return 0;
        }
    }

    /**
     * Save high score to localStorage
     */
    saveHighScore(score) {
        try {
            localStorage.setItem(this.storageKey, String(score));
        } catch (e) {
            console.warn('Unable to save high score to localStorage:', e);
        }
    }

    /**
     * Reset snake and state data
     */
    resetGameData() {
        this.snake = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        this.dir = { x: 1, y: 0 };
        this.nextDir = { x: 1, y: 0 };
        this.score = 0;
        this.hasNewRecord = false;
        this.spawnFood();
        this.updateHUD();
    }

    /**
     * Spawn food on a cell not occupied by the snake
     */
    spawnFood() {
        const availableCells = [];
        for (let x = 0; x < this.gridSize; x++) {
            for (let y = 0; y < this.gridSize; y++) {
                const isSnake = this.snake.some(seg => seg.x === x && seg.y === y);
                if (!isSnake) {
                    availableCells.push({ x, y });
                }
            }
        }

        if (availableCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableCells.length);
            this.food = availableCells[randomIndex];
        } else {
            // Screen filled! (Win condition, keep current food)
            this.food = { x: 0, y: 0 };
        }
    }

    /**
     * Attach all input and touch event listeners
     */
    bindEvents() {
        window.addEventListener('keydown', this.boundKeyHandler);

        // Canvas touch gestures
        if (this.canvas) {
            this.canvas.addEventListener('touchstart', this.boundTouchStart, { passive: false });
            this.canvas.addEventListener('touchmove', this.boundTouchMove, { passive: false });
            this.canvas.addEventListener('touchend', this.boundTouchEnd, { passive: false });
        }

        // Button clicks
        this.elements.startBtn?.addEventListener('click', () => this.startGame());
        this.elements.pauseBtn?.addEventListener('click', () => this.togglePause());
        this.elements.resumeBtn?.addEventListener('click', () => this.resumeGame());
        this.elements.restartBtn?.addEventListener('click', () => this.restartGame());
        this.elements.restartHudBtn?.addEventListener('click', () => this.restartGame());
        this.elements.restartFromPauseBtn?.addEventListener('click', () => this.restartGame());
        this.elements.exitToMenuBtn?.addEventListener('click', () => this.exitToMenu());
        this.elements.backToMenuBtn?.addEventListener('click', () => this.exitToMenu());

        // D-Pad touch/pointer handlers
        const bindDpad = (btn, dirX, dirY) => {
            if (!btn) return;
            const handleDir = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.initAudio();
                if (this.state === 'START') {
                    this.startGame();
                }
                this.setDirection(dirX, dirY);
            };
            btn.addEventListener('pointerdown', handleDir);
            btn.addEventListener('click', handleDir);
        };

        bindDpad(this.elements.dpadUp, 0, -1);
        bindDpad(this.elements.dpadDown, 0, 1);
        bindDpad(this.elements.dpadLeft, -1, 0);
        bindDpad(this.elements.dpadRight, 1, 0);

        // Resize listener for DPI changes
        this.boundResizeHandler = () => this.setupDPI();
        window.addEventListener('resize', this.boundResizeHandler);
    }

    /**
     * Canvas touch gesture handlers (swipe detection)
     */
    handleCanvasTouchStart(e) {
        if (!e.touches || e.touches.length === 0) return;
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.initAudio();

        if (this.state === 'START') {
            e.preventDefault();
            this.startGame();
        }
    }

    handleCanvasTouchMove(e) {
        // Prevent window scrolling while swiping on the game canvas
        if (e.cancelable) {
            e.preventDefault();
        }
    }

    handleCanvasTouchEnd(e) {
        if (!e.changedTouches || e.changedTouches.length === 0) return;
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const dx = touchEndX - this.touchStartX;
        const dy = touchEndY - this.touchStartY;
        const minSwipeDistance = 20;

        if (Math.hypot(dx, dy) >= minSwipeDistance) {
            if (Math.abs(dx) > Math.abs(dy)) {
                // Horizontal swipe
                if (dx > 0) this.setDirection(1, 0);
                else this.setDirection(-1, 0);
            } else {
                // Vertical swipe
                if (dy > 0) this.setDirection(0, 1);
                else this.setDirection(0, -1);
            }
        }
    }

    /**
     * Global keyboard input handler
     */
    handleKeyDown(e) {
        const key = e.key;

        // Prevent browser scroll on arrow keys and space when active
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(key)) {
            e.preventDefault();
        }

        this.initAudio();

        if (this.state === 'START') {
            // Any steering or action key starts the game
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'W', 's', 'S', 'a', 'A', 'd', 'D', ' ', 'Enter'].includes(key)) {
                this.startGame();
                if (['ArrowUp', 'w', 'W'].includes(key)) this.setDirection(0, -1);
                else if (['ArrowDown', 's', 'S'].includes(key)) this.setDirection(0, 1);
                else if (['ArrowLeft', 'a', 'A'].includes(key)) this.setDirection(-1, 0);
                else if (['ArrowRight', 'd', 'D'].includes(key)) this.setDirection(1, 0);
                return;
            }
        }

        if (this.state === 'PLAYING') {
            switch (key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    this.setDirection(0, -1);
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    this.setDirection(0, 1);
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    this.setDirection(-1, 0);
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    this.setDirection(1, 0);
                    break;
                case ' ':
                case 'p':
                case 'P':
                    this.togglePause();
                    break;
                case 'r':
                case 'R':
                    this.restartGame();
                    break;
                case 'Escape':
                    this.exitToMenu();
                    break;
            }
            return;
        }

        if (this.state === 'PAUSED') {
            if (key === ' ' || key === 'p' || key === 'P' || key === 'Enter') {
                this.resumeGame();
            } else if (key === 'r' || key === 'R') {
                this.restartGame();
            } else if (key === 'Escape') {
                this.exitToMenu();
            }
            return;
        }

        if (this.state === 'GAMEOVER') {
            if (key === 'r' || key === 'R' || key === 'Enter' || key === ' ') {
                this.restartGame();
            } else if (key === 'Escape') {
                this.exitToMenu();
            }
        }
    }

    /**
     * Queue new direction, preventing 180° immediate self-collision
     */
    setDirection(x, y) {
        // Disallow reversing into current direction
        if (this.dir.x + x === 0 && this.dir.y + y === 0) {
            return;
        }
        this.nextDir = { x, y };
    }

    /**
     * Start the game from the initial start screen
     */
    startGame() {
        this.resetGameData();
        this.state = 'PLAYING';
        this.updateHUD();
        this.hideAllOverlays();
        this.playBeep(440, 0.08, 'square');

        if (this.elements.statusText) {
            this.elements.statusText.textContent = 'AGENT: 0x7701 // STATUS: EXPLORING';
        }

        this.announce('Latent Explorer started. Steer vector using arrow keys or WASD. Score is 0.');

        clearInterval(this.gameInterval);
        this.gameInterval = setInterval(() => this.tick(), this.tickSpeed);
    }

    /**
     * Toggle between PAUSED and PLAYING
     */
    togglePause() {
        if (this.state === 'PLAYING') {
            this.pauseGame();
        } else if (this.state === 'PAUSED') {
            this.resumeGame();
        }
    }

    pauseGame() {
        this.state = 'PAUSED';
        clearInterval(this.gameInterval);
        if (this.elements.pauseOverlay) this.elements.pauseOverlay.style.display = 'flex';
        if (this.elements.pauseBtnText) this.elements.pauseBtnText.textContent = 'RESUME [SPACE]';
        if (this.elements.statusText) {
            this.elements.statusText.textContent = 'AGENT: 0x7701 // STATUS: SUSPENDED';
        }
        this.announce('Game paused. Press Space or click Resume to continue.');
        this.elements.resumeBtn?.focus();
    }

    resumeGame() {
        this.state = 'PLAYING';
        this.hideAllOverlays();
        if (this.elements.pauseBtnText) this.elements.pauseBtnText.textContent = 'PAUSE [SPACE]';
        if (this.elements.statusText) {
            this.elements.statusText.textContent = 'AGENT: 0x7701 // STATUS: EXPLORING';
        }
        this.announce('Game resumed.');
        clearInterval(this.gameInterval);
        this.gameInterval = setInterval(() => this.tick(), this.tickSpeed);
    }

    /**
     * Restart current game session
     */
    restartGame() {
        clearInterval(this.gameInterval);
        this.startGame();
    }

    /**
     * Return back to Workspace 5 arcade executables directory
     */
    exitToMenu() {
        this.destroy();
        this.onReturnToMenu();
    }

    /**
     * Core game loop tick
     */
    tick() {
        if (this.state !== 'PLAYING') return;

        // Apply queued direction
        this.dir = { ...this.nextDir };

        const head = this.snake[0];
        const newHead = {
            x: head.x + this.dir.x,
            y: head.y + this.dir.y
        };

        // Wall collision check
        if (
            newHead.x < 0 ||
            newHead.x >= this.gridSize ||
            newHead.y < 0 ||
            newHead.y >= this.gridSize
        ) {
            this.triggerGameOver('WALL_COLLISION');
            return;
        }

        // Self collision check
        for (let i = 0; i < this.snake.length; i++) {
            if (newHead.x === this.snake[i].x && newHead.y === this.snake[i].y) {
                this.triggerGameOver('SELF_COLLISION');
                return;
            }
        }

        // Add new head
        this.snake.unshift(newHead);

        // Food consumption check
        if (newHead.x === this.food.x && newHead.y === this.food.y) {
            this.score += 10;
            this.eatEffectTimer = 4; // visual flash duration
            this.playEatSound();

            if (this.score > this.highScore) {
                this.highScore = this.score;
                this.hasNewRecord = true;
                this.saveHighScore(this.highScore);
            }

            this.spawnFood();
            this.updateHUD();

            // Announce milestone score changes to screen reader
            if (this.score % 50 === 0) {
                this.announce(`Vectors: ${this.score}. Trajectory dimension: ${this.snake.length}.`);
            }
        } else {
            // Remove tail segment if not eating
            this.snake.pop();
        }

        this.renderFrame();
    }

    /**
     * Handle game over sequence
     */
    triggerGameOver(reason) {
        this.state = 'GAMEOVER';
        clearInterval(this.gameInterval);
        this.playCrashSound();

        if (this.elements.statusText) {
            this.elements.statusText.textContent = 'AGENT: 0x7701 // STATUS: COLLAPSED';
        }

        const formattedFinal = String(this.score).padStart(4, '0');
        const formattedBest = String(this.highScore).padStart(4, '0');

        if (this.elements.finalScore) this.elements.finalScore.textContent = formattedFinal;
        if (this.elements.gameOverBest) this.elements.gameOverBest.textContent = formattedBest;
        if (this.elements.gameOverTag) {
            this.elements.gameOverTag.textContent = reason === 'WALL_COLLISION'
                ? '[ TRAJECTORY COLLAPSED: BOUNDARY DRIFT ]'
                : '[ TRAJECTORY COLLAPSED: SELF-INTERSECTION ]';
        }
        if (this.elements.newHighScoreBadge) {
            this.elements.newHighScoreBadge.style.display = this.hasNewRecord ? 'block' : 'none';
        }

        if (this.elements.gameOverOverlay) {
            this.elements.gameOverOverlay.style.display = 'flex';
        }

        // Focus restart button immediately for rapid keyboard accessibility
        this.elements.restartBtn?.focus();
        setTimeout(() => {
            this.elements.restartBtn?.focus();
        }, 50);

        const reasonMsg = reason === 'WALL_COLLISION' ? 'Boundary drift limit reached' : 'Trajectory self-intersection';
        const recordMsg = this.hasNewRecord ? ' New peak vectors recorded!' : '';
        this.announce(`Trajectory collapsed: ${reasonMsg}. Final vectors: ${this.score}. Peak: ${this.highScore}.${recordMsg} Press R or Enter to explore again.`);

        this.renderFrame();
    }

    /**
     * Screen reader announcement helper
     */
    announce(text) {
        if (this.elements.announcer) {
            this.elements.announcer.textContent = '';
            setTimeout(() => {
                if (this.elements.announcer) {
                    this.elements.announcer.textContent = text;
                }
            }, 30);
        }
    }

    /**
     * Hide all screen overlays
     */
    hideAllOverlays() {
        if (this.elements.startOverlay) this.elements.startOverlay.style.display = 'none';
        if (this.elements.pauseOverlay) this.elements.pauseOverlay.style.display = 'none';
        if (this.elements.gameOverOverlay) this.elements.gameOverOverlay.style.display = 'none';
    }

    /**
     * Update HUD telemetry numbers
     */
    updateHUD() {
        if (this.elements.scoreDisplay) {
            this.elements.scoreDisplay.textContent = String(this.score).padStart(4, '0');
        }
        if (this.elements.highScoreDisplay) {
            this.elements.highScoreDisplay.textContent = String(this.highScore).padStart(4, '0');
        }
        if (this.elements.lengthDisplay) {
            this.elements.lengthDisplay.textContent = String(this.snake.length).padStart(2, '0');
        }
    }

    /**
     * Retrieve current theme accent colors from CSS variables
     */
    getThemeColors() {
        if (typeof window === 'undefined') {
            return {
                cyan: '#00ffff',
                purple: '#a855f7',
                green: '#39ff14',
                magenta: '#ff2a85'
            };
        }
        const style = getComputedStyle(document.documentElement);
        const cyan = style.getPropertyValue('--accent-cyan').trim() || '#00ffff';
        const purple = style.getPropertyValue('--accent-purple').trim() || '#a855f7';
        const green = style.getPropertyValue('--accent-green').trim() || '#39ff14';
        const magenta = style.getPropertyValue('--accent-magenta').trim() || '#ff2a85';
        return { cyan, purple, green, magenta };
    }

    startRenderLoop() {
        if (this.animFrameId) return;
        this.animFrameId = requestAnimationFrame(this.boundRenderLoop);
    }

    stopRenderLoop() {
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }
    }

    renderLoop(timestamp) {
        this.renderFrame(timestamp);
        this.animFrameId = requestAnimationFrame(this.boundRenderLoop);
    }

    parseColor(colorStr) {
        if (!colorStr) return { r: 0, g: 255, b: 255 };
        if (colorStr.startsWith('#')) {
            let hex = colorStr.slice(1);
            if (hex.length === 3) {
                hex = hex.split('').map(c => c + c).join('');
            }
            const num = parseInt(hex, 16);
            return {
                r: (num >> 16) & 255,
                g: (num >> 8) & 255,
                b: num & 255
            };
        }
        const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
            return {
                r: parseInt(match[1], 10),
                g: parseInt(match[2], 10),
                b: parseInt(match[3], 10)
            };
        }
        return { r: 0, g: 255, b: 255 };
    }

    interpolateRgb(c1, c2, factor) {
        const f = Math.max(0, Math.min(1, factor));
        return {
            r: Math.round(c1.r + (c2.r - c1.r) * f),
            g: Math.round(c1.g + (c2.g - c1.g) * f),
            b: Math.round(c1.b + (c2.b - c1.b) * f)
        };
    }

    drawRoundedRect(ctx, x, y, width, height, radius) {
        if (typeof ctx.roundRect === 'function') {
            ctx.beginPath();
            ctx.roundRect(x, y, width, height, radius);
        } else {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
        }
    }

    /**
     * Canvas rendering frame
     */
    renderFrame(timestamp) {
        if (!this.ctx) return;
        const ctx = this.ctx;
        const cs = this.cellSize;
        const size = this.canvasSize;
        const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const theme = this.getThemeColors();
        const cyanRgb = this.parseColor(theme.cyan);
        const purpleRgb = this.parseColor(theme.purple);
        const greenRgb = this.parseColor(theme.green);

        // 1. Clear background (Deep terminal dark)
        ctx.fillStyle = '#0a0e14';
        ctx.fillRect(0, 0, size, size);

        // 2. Subtle terminal grid matrix
        ctx.strokeStyle = 'rgba(57, 255, 20, 0.05)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= size; x += cs) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, size);
            ctx.stroke();
        }
        for (let y = 0; y <= size; y += cs) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(size, y);
            ctx.stroke();
        }

        // 3. Optional eat flash effect (disabled under prefers-reduced-motion)
        if (this.eatEffectTimer > 0 && !isReducedMotion) {
            ctx.fillStyle = `rgba(255, 42, 133, ${this.eatEffectTimer * 0.04})`;
            ctx.fillRect(0, 0, size, size);
            this.eatEffectTimer--;
        }

        // 4. Render Data Node (Circular, pulsing glowing node using contrasting magenta)
        const fx = this.food.x * cs;
        const fy = this.food.y * cs;
        const fcx = fx + cs / 2;
        const fcy = fy + cs / 2;

        const time = timestamp || (typeof performance !== 'undefined' ? performance.now() : Date.now());
        // Gentle pulse oscillation: 0.0 to 1.0 (disabled under prefers-reduced-motion)
        const pulse = isReducedMotion ? 0 : (Math.sin(time * 0.005) + 1) / 2;

        const baseRadius = cs * 0.32; // ~6.4px
        const currentRadius = baseRadius + (isReducedMotion ? 0 : pulse * 1.5);
        const nodeColor = theme.magenta || '#ff2a85';

        ctx.save();
        if (!isReducedMotion) {
            ctx.shadowColor = nodeColor;
            ctx.shadowBlur = 8 + pulse * 6;
        }

        // Faint outer pulsing telemetry aura (gentle ambient radiation)
        if (!isReducedMotion) {
            ctx.beginPath();
            ctx.arc(fcx, fcy, baseRadius + 3.5 + pulse * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 42, 133, ${0.14 - pulse * 0.07})`;
            ctx.fill();
        }

        // Outer data node boundary ring
        ctx.beginPath();
        ctx.arc(fcx, fcy, currentRadius + 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 42, 133, ${isReducedMotion ? 0.6 : 0.45 + pulse * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Main data node spherical body
        ctx.beginPath();
        ctx.arc(fcx, fcy, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();

        // High-density core embedding pip (bright white data center)
        ctx.beginPath();
        ctx.arc(fcx, fcy, Math.max(1.5, currentRadius * 0.42), 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.restore();

        // 5. Render Agent Trajectory Trail (Smooth gradient: Cyan -> Purple -> Green)
        for (let i = this.snake.length - 1; i > 0; i--) {
            const seg = this.snake[i];
            const sx = seg.x * cs;
            const sy = seg.y * cs;
            const inset = 2;
            const segSize = cs - inset * 2;
            const segRadius = 5;

            // Normalized distance along trail: 0.0 (near head) to 1.0 (tail)
            const progress = this.snake.length > 2
                ? (i - 1) / (this.snake.length - 2)
                : 0;

            let rgb;
            if (progress <= 0.5) {
                // Head (cyan) to mid (purple)
                rgb = this.interpolateRgb(cyanRgb, purpleRgb, progress / 0.5);
            } else {
                // Mid (purple) to tail (green)
                rgb = this.interpolateRgb(purpleRgb, greenRgb, (progress - 0.5) / 0.5);
            }

            // Subtle alpha taper toward tail (0.95 down to 0.70)
            const alpha = 0.95 - progress * 0.25;

            ctx.save();
            if (!isReducedMotion) {
                ctx.shadowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.55)`;
                ctx.shadowBlur = 6;
            }

            this.drawRoundedRect(ctx, sx + inset, sy + inset, segSize, segSize, segRadius);
            ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
            ctx.fill();

            // Segment border glow
            ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Inner core pip for futuristic telemetry look
            ctx.fillStyle = `rgba(255, 255, 255, ${0.4 - progress * 0.25})`;
            ctx.beginPath();
            ctx.arc(sx + cs / 2, sy + cs / 2, 1.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }

        // 6. Render Agent Head (Circular bright agent node with soft cyan glow)
        if (this.snake.length > 0) {
            const head = this.snake[0];
            const cx = head.x * cs + cs / 2;
            const cy = head.y * cs + cs / 2;
            const headRadius = cs / 2 - 1.5;

            ctx.save();
            if (!isReducedMotion) {
                ctx.shadowColor = theme.cyan;
                ctx.shadowBlur = 12;
            }

            // Outer agent circular node
            ctx.beginPath();
            ctx.arc(cx, cy, headRadius, 0, Math.PI * 2);
            ctx.fillStyle = theme.cyan;
            ctx.fill();

            // Subtle border ring
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Bright white agent core
            ctx.beginPath();
            ctx.arc(cx, cy, headRadius * 0.45, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();

            // Directional aperture / vector focal point
            const pointerDist = headRadius * 0.45;
            const px = cx + this.dir.x * pointerDist;
            const py = cy + this.dir.y * pointerDist;
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#0a0e14';
            ctx.fill();

            ctx.restore();
        }
    }

    /**
     * WebAudio API synthesizer helpers
     */
    initAudio() {
        if (!this.audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                try {
                    this.audioCtx = new AudioContextClass();
                } catch (e) {
                    console.warn('AudioContext initialization ignored:', e);
                }
            }
        }
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume().catch(() => {});
        }
    }

    playBeep(freq, duration, type = 'square') {
        try {
            if (!this.audioCtx) return;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

            gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start();
            osc.stop(this.audioCtx.currentTime + duration);
        } catch (e) {
            // Audio degradation safe
        }
    }

    playEatSound() {
        try {
            if (!this.audioCtx) return;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'sine';

            osc.frequency.setValueAtTime(520, this.audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.08);

            gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.08);
        } catch (e) {
            // Silent fallback
        }
    }

    playCrashSound() {
        try {
            if (!this.audioCtx) return;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'sawtooth';

            osc.frequency.setValueAtTime(180, this.audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(45, this.audioCtx.currentTime + 0.25);

            gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.25);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.25);
        } catch (e) {
            // Silent fallback
        }
    }

    /**
     * Cleanly teardown timers, listeners, and references
     */
    destroy() {
        this.stopRenderLoop();
        clearInterval(this.gameInterval);
        this.gameInterval = null;

        window.removeEventListener('keydown', this.boundKeyHandler);
        if (this.boundResizeHandler) {
            window.removeEventListener('resize', this.boundResizeHandler);
        }

        if (this.canvas) {
            this.canvas.removeEventListener('touchstart', this.boundTouchStart);
            this.canvas.removeEventListener('touchmove', this.boundTouchMove);
            this.canvas.removeEventListener('touchend', this.boundTouchEnd);
        }

        if (this.audioCtx && typeof this.audioCtx.close === 'function') {
            try {
                this.audioCtx.close();
            } catch (e) {}
            this.audioCtx = null;
        }
    }
}

if (typeof window !== 'undefined') {
    window.ArcadeSnakeGame = ArcadeSnakeGame;
}
