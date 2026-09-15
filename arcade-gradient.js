/**
 * ArcadeGradientGame - Retro Terminal HTML5 Canvas Breakout Engine ("Gradient Descent")
 * Workspace 5 Arcade - AliJ Portfolio
 *
 * The player is descending a loss landscape:
 * - Optimizer paddle = gradient descent optimizer
 * - Ball = parameter position vector in loss landscape
 * - Blocks = loss terms to eliminate toward convergence
 * - Clearing field = CONVERGED
 * - Missing ball 3 times = DIVERGED
 */

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;
const PADDLE_WIDTH = 76;
const PADDLE_HEIGHT = 10;
const PADDLE_Y = 470;
const BALL_RADIUS = 5;
const BASE_BALL_SPEED = 290; // Virtual px/sec
const BASE_PADDLE_SPEED = 420; // Virtual px/sec

const LEARNING_RATE_LEVELS = [0.5, 0.75, 1.0, 1.5, 2.0];
const DEFAULT_LR_INDEX = 2; // 1.0x

class ArcadeGradientGame {
    constructor(options = {}) {
        this.canvas = document.getElementById('gradient-canvas');
        if (!this.canvas) {
            console.error('ArcadeGradientGame: #gradient-canvas element not found.');
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        this.onReturnToMenu = typeof options.onReturnToMenu === 'function' ? options.onReturnToMenu : null;
        this.storageKey = 'arcade-gradient-descent-highscore';

        this.state = 'START'; // 'START' | 'PLAYING' | 'PAUSED' | 'CONVERGED' | 'GAMEOVER'
        this.score = 0;
        this.highScore = this.loadHighScore();
        this.lives = 3;
        this.epoch = 1;
        this.blocksCleared = 0;
        this.totalBlocksInEpoch = 0;

        // Learning rate dial
        this.lrIndex = DEFAULT_LR_INDEX;
        this.learningRate = LEARNING_RATE_LEVELS[this.lrIndex];

        // Paddle state
        this.paddle = {
            x: CANVAS_WIDTH / 2,
            y: PADDLE_Y,
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT,
            vx: 0,
            targetX: CANVAS_WIDTH / 2,
            moveDir: 0 // -1: left, 1: right, 0: idle
        };

        // Ball state
        this.ball = {
            x: CANVAS_WIDTH / 2,
            y: PADDLE_Y - BALL_RADIUS - 1,
            vx: 0,
            vy: 0,
            radius: BALL_RADIUS,
            isAttached: true,
            speed: BASE_BALL_SPEED,
            trail: []
        };

        // Local minima trap state (expanded in Step 3)
        this.trap = {
            isTrapped: false,
            block: null,
            bouncesRemaining: 0,
            totalBouncesNeeded: 6,
            oscillationTimer: 0,
            cueTimeout: null
        };

        // Field blocks & particles
        this.blocks = [];
        this.particles = [];

        // Animation / timing
        this.lastTime = null;
        this.animFrameId = null;
        this.touchCleanups = [];

        this.initDOM();
        this.setupDPI();
        this.generateField(this.epoch);
        this.updateHUD();
        this.bindEvents();
        this.startRenderLoop();
    }

    setupDPI() {
        const dpr = window.devicePixelRatio || 1;
        if (this.canvas && this.ctx) {
            this.canvas.width = CANVAS_WIDTH * dpr;
            this.canvas.height = CANVAS_HEIGHT * dpr;
            this.ctx.resetTransform?.();
            this.ctx.scale(dpr, dpr);
        }
    }

    initDOM() {
        this.dom = {
            scoreDisplay: document.getElementById('gradient-score-display'),
            highscoreDisplay: document.getElementById('gradient-highscore-display'),
            epochDisplay: document.getElementById('gradient-epoch-display'),
            livesDisplay: document.getElementById('gradient-lives-display'),
            lrDisplay: document.getElementById('gradient-lr-display'),
            touchLrDisplay: document.getElementById('touch-lr-display'),
            lrDecBtn: document.getElementById('gradient-lr-dec-btn'),
            lrIncBtn: document.getElementById('gradient-lr-inc-btn'),
            touchLrDecBtn: document.getElementById('touch-lr-dec'),
            touchLrIncBtn: document.getElementById('touch-lr-inc'),
            pauseBtn: document.getElementById('gradient-pause-btn'),
            pauseBtnText: document.getElementById('gradient-pause-btn-text'),
            restartHudBtn: document.getElementById('gradient-restart-hud-btn'),
            cue: document.getElementById('gradient-cue'),
            cueText: document.getElementById('gradient-cue-text'),
            startOverlay: document.getElementById('gradient-start-overlay'),
            pauseOverlay: document.getElementById('gradient-pause-overlay'),
            convergedOverlay: document.getElementById('gradient-converged-overlay'),
            gameoverOverlay: document.getElementById('gradient-gameover-overlay'),
            startBtn: document.getElementById('gradient-start-btn'),
            resumeBtn: document.getElementById('gradient-resume-btn'),
            restartFromPauseBtn: document.getElementById('gradient-restart-from-pause-btn'),
            nextEpochBtn: document.getElementById('gradient-next-epoch-btn'),
            restartBtn: document.getElementById('gradient-restart-btn'),
            exitToMenuBtn: document.getElementById('gradient-exit-to-menu-btn'),
            backToMenuBtn: document.getElementById('arcade-back-to-menu-btn'),
            convergedScore: document.getElementById('gradient-converged-score'),
            convergedEpoch: document.getElementById('gradient-converged-epoch'),
            finalScore: document.getElementById('gradient-final-score'),
            gameoverBest: document.getElementById('gradient-gameover-best'),
            gameoverEpoch: document.getElementById('gradient-gameover-epoch'),
            gameoverBlocks: document.getElementById('gradient-gameover-blocks'),
            newHighscoreBadge: document.getElementById('gradient-new-highscore-badge'),
            touchPaddleLeft: document.getElementById('touch-paddle-left'),
            touchPaddleRight: document.getElementById('touch-paddle-right'),
            touchLaunch: document.getElementById('touch-launch'),
            touchLaunchText: document.getElementById('touch-launch-text'),
            liveAnnouncer: document.getElementById('gradient-live-announcer'),
            statusText: document.getElementById('gradient-status-text')
        };
    }

    loadHighScore() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            const val = parseInt(saved, 10);
            return isNaN(val) || val < 0 ? 0 : val;
        } catch (e) {
            return 0;
        }
    }

    saveHighScore(val) {
        try {
            localStorage.setItem(this.storageKey, String(val));
            this.highScore = val;
        } catch (e) {
            // localStorage unavailable
        }
    }

    announce(text) {
        if (!this.dom.liveAnnouncer) return;
        if (this.dom.liveAnnouncer.textContent === text) {
            this.dom.liveAnnouncer.textContent = '';
            requestAnimationFrame(() => {
                if (this.dom.liveAnnouncer) this.dom.liveAnnouncer.textContent = text;
            });
        } else {
            this.dom.liveAnnouncer.textContent = text;
        }
    }

    /**
     * Generates an irregular "loss landscape" field of breakable blocks.
     * The layout contours evoke level sets of 2D loss surfaces.
     */
    generateField(epoch) {
        this.blocks = [];
        const cols = 9;
        const rows = 6 + Math.min(2, epoch - 1);
        const blockW = 38;
        const blockH = 15;
        const startX = (CANVAS_WIDTH - (cols * blockW + (cols - 1) * 4)) / 2;
        const startY = 55;

        // Choose landscape topography style based on epoch
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                // Compute normalized coordinate (-1 to 1)
                const nx = (c - (cols - 1) / 2) / ((cols - 1) / 2);
                const ny = (r - (rows - 1) / 2) / ((rows - 1) / 2);

                let keep = false;
                let tier = 1;

                if (epoch === 1) {
                    // Saddle / Parabolic Valley
                    const distFromCenter = Math.abs(nx);
                    if (r === 0 || r === 1) keep = true;
                    else if (r === 2 && distFromCenter < 0.8) keep = true;
                    else if (r === 3 && distFromCenter < 0.6) keep = true;
                    else if (r >= 4 && distFromCenter < 0.4) keep = true;
                    tier = r < 2 ? 2 : 1;
                } else if (epoch === 2) {
                    // Banana valley (Rosenbrock curvature)
                    const curve = Math.sin((c / (cols - 1)) * Math.PI);
                    if (r < 2) keep = true;
                    else if (r >= 2 && r <= 5) {
                        keep = Math.abs(ny - (curve * 0.4 - 0.2)) < 0.6;
                    } else {
                        keep = c % 2 === 0;
                    }
                    tier = r < 2 ? 3 : (r < 4 ? 2 : 1);
                } else {
                    // Multi-modal landscape with peaks and basins
                    const wave = Math.sin(c * 0.9) * Math.cos(r * 1.1);
                    keep = wave > -0.45;
                    tier = (r + c) % 3 + 1;
                }

                if (keep) {
                    const bx = startX + c * (blockW + 4);
                    const by = startY + r * (blockH + 4);
                    let baseScore = 100;
                    let color = '#39ff14'; // accent green
                    let health = 1;

                    if (tier === 2) {
                        baseScore = 200;
                        color = '#00f5ff'; // accent cyan
                        health = 2;
                    } else if (tier === 3) {
                        baseScore = 300;
                        color = '#ffb454'; // accent yellow/orange
                        health = 2;
                    }

                    this.blocks.push({
                        id: `block_${r}_${c}`,
                        x: bx,
                        y: by,
                        w: blockW,
                        h: blockH,
                        tier: tier,
                        health: health,
                        maxHealth: health,
                        baseScore: baseScore,
                        color: color,
                        isLocalMinimum: false
                    });
                }
            }
        }

        this.totalBlocksInEpoch = this.blocks.length;
    }

    setLearningRateIndex(index, announceChange = true) {
        const prev = this.lrIndex;
        this.lrIndex = Math.max(0, Math.min(LEARNING_RATE_LEVELS.length - 1, index));
        this.learningRate = LEARNING_RATE_LEVELS[this.lrIndex];

        if (this.dom.lrDisplay) this.dom.lrDisplay.textContent = `${this.learningRate.toFixed(2).replace(/\.00$/, '.0')}x`;
        if (this.dom.touchLrDisplay) this.dom.touchLrDisplay.textContent = `${this.learningRate.toFixed(2).replace(/\.00$/, '.0')}x`;

        if (prev !== this.lrIndex && announceChange && this.state !== 'START') {
            this.announce(`Learning rate set to ${this.learningRate}x. Multiplier ${this.learningRate}x.`);
        }
    }

    adjustLearningRate(delta) {
        this.setLearningRateIndex(this.lrIndex + delta, true);
    }

    launchBall() {
        if (!this.ball.isAttached) return;
        this.ball.isAttached = false;
        // Launch ball with upward angle slightly influenced by current paddle velocity or default 70 deg
        let angle = -Math.PI / 2;
        if (this.paddle.vx !== 0) {
            const dir = Math.sign(this.paddle.vx);
            angle += dir * (Math.PI / 8);
        } else {
            angle += (Math.random() - 0.5) * (Math.PI / 6);
        }
        this.ball.vx = this.ball.speed * Math.cos(angle);
        this.ball.vy = this.ball.speed * Math.sin(angle);

        if (this.dom.touchLaunchText) {
            this.dom.touchLaunchText.textContent = '⏸ PAUSE';
        }
        if (this.dom.statusText) {
            this.dom.statusText.textContent = `OPTIMIZER: 0x6E4D // DESCENDING EPOCH ${String(this.epoch).padStart(2, '0')}`;
        }
    }

    startGame() {
        this.hideAllOverlays();
        this.state = 'PLAYING';
        this.launchBall();
        this.announce(`Gradient descent started. Epoch ${this.epoch}. Steer optimizer paddle to eliminate loss terms.`);
    }

    pauseGame() {
        if (this.state !== 'PLAYING') return;
        this.state = 'PAUSED';
        if (this.dom.pauseOverlay) this.dom.pauseOverlay.style.display = 'flex';
        if (this.dom.pauseBtnText) this.dom.pauseBtnText.textContent = 'RESUME [P]';
        if (this.dom.touchLaunchText) this.dom.touchLaunchText.textContent = '▶ RESUME';
        if (this.dom.resumeBtn) this.dom.resumeBtn.focus();
        this.announce('Optimization thread suspended.');
    }

    resumeGame() {
        if (this.state !== 'PAUSED') return;
        this.state = 'PLAYING';
        if (this.dom.pauseOverlay) this.dom.pauseOverlay.style.display = 'none';
        if (this.dom.pauseBtnText) this.dom.pauseBtnText.textContent = 'PAUSE [P]';
        if (this.dom.touchLaunchText) this.dom.touchLaunchText.textContent = '⏸ PAUSE';
        this.lastTime = performance.now();
        this.announce('Optimization thread resumed.');
    }

    togglePause() {
        if (this.state === 'START') {
            this.startGame();
        } else if (this.state === 'PLAYING') {
            if (this.ball.isAttached) {
                this.launchBall();
            } else {
                this.pauseGame();
            }
        } else if (this.state === 'PAUSED') {
            this.resumeGame();
        } else if (this.state === 'CONVERGED') {
            this.proceedToNextEpoch();
        } else if (this.state === 'GAMEOVER') {
            this.restartGame();
        }
    }

    proceedToNextEpoch() {
        this.epoch++;
        this.hideAllOverlays();
        this.generateField(this.epoch);

        // Reset ball to paddle
        this.ball.isAttached = true;
        this.ball.x = this.paddle.x;
        this.ball.y = PADDLE_Y - BALL_RADIUS - 1;
        this.ball.vx = 0;
        this.ball.vy = 0;
        this.ball.speed = BASE_BALL_SPEED + (this.epoch - 1) * 15;

        this.state = 'PLAYING';
        this.updateHUD();
        this.announce(`Epoch ${this.epoch} initialized. Field loss landscape generated.`);
        if (this.dom.statusText) {
            this.dom.statusText.textContent = `OPTIMIZER: 0x6E4D // EPOCH ${String(this.epoch).padStart(2, '0')}`;
        }
    }

    triggerConverged() {
        this.state = 'CONVERGED';
        this.score += Math.round(1000 * this.learningRate);
        if (this.score > this.highScore) {
            this.saveHighScore(this.score);
        }
        this.updateHUD();

        if (this.dom.convergedScore) this.dom.convergedScore.textContent = String(this.score).padStart(6, '0');
        if (this.dom.convergedEpoch) this.dom.convergedEpoch.textContent = String(this.epoch).padStart(2, '0');
        if (this.dom.convergedOverlay) this.dom.convergedOverlay.style.display = 'flex';
        if (this.dom.nextEpochBtn) this.dom.nextEpochBtn.focus();

        this.announce(`Convergence achieved! Epoch ${this.epoch} cleared. Total loss reduced: ${this.score}.`);
    }

    triggerGameOver() {
        this.state = 'GAMEOVER';
        const isNewRecord = this.score > this.highScore;
        if (isNewRecord) {
            this.saveHighScore(this.score);
        }
        this.updateHUD();

        if (this.dom.finalScore) this.dom.finalScore.textContent = String(this.score).padStart(6, '0');
        if (this.dom.gameoverBest) this.dom.gameoverBest.textContent = String(this.highScore).padStart(6, '0');
        if (this.dom.gameoverEpoch) this.dom.gameoverEpoch.textContent = String(this.epoch).padStart(2, '0');
        if (this.dom.gameoverBlocks) this.dom.gameoverBlocks.textContent = String(this.blocksCleared);

        if (this.dom.newHighscoreBadge) {
            this.dom.newHighscoreBadge.style.display = isNewRecord ? 'block' : 'none';
        }

        if (this.dom.gameoverOverlay) this.dom.gameoverOverlay.style.display = 'flex';
        if (this.dom.restartBtn) this.dom.restartBtn.focus();

        this.announce(`Loss diverged! Attempts exhausted. Final loss reduced: ${this.score}. Epoch: ${this.epoch}.`);
    }

    restartGame() {
        this.score = 0;
        this.lives = 3;
        this.epoch = 1;
        this.blocksCleared = 0;
        this.setLearningRateIndex(DEFAULT_LR_INDEX, false);

        this.paddle.x = CANVAS_WIDTH / 2;
        this.paddle.vx = 0;
        this.paddle.moveDir = 0;

        this.ball.isAttached = true;
        this.ball.x = this.paddle.x;
        this.ball.y = PADDLE_Y - BALL_RADIUS - 1;
        this.ball.vx = 0;
        this.ball.vy = 0;
        this.ball.speed = BASE_BALL_SPEED;
        this.ball.trail = [];

        this.particles = [];
        this.hideAllOverlays();
        this.generateField(this.epoch);
        this.updateHUD();

        this.state = 'PLAYING';
        this.lastTime = performance.now();
        this.announce('Optimization restarted. Gradient steps reset to 3.');
        if (this.dom.statusText) {
            this.dom.statusText.textContent = `OPTIMIZER: 0x6E4D // STATUS: READY`;
        }
    }

    hideAllOverlays() {
        if (this.dom.startOverlay) this.dom.startOverlay.style.display = 'none';
        if (this.dom.pauseOverlay) this.dom.pauseOverlay.style.display = 'none';
        if (this.dom.convergedOverlay) this.dom.convergedOverlay.style.display = 'none';
        if (this.dom.gameoverOverlay) this.dom.gameoverOverlay.style.display = 'none';
    }

    updateHUD() {
        if (this.dom.scoreDisplay) this.dom.scoreDisplay.textContent = String(this.score).padStart(6, '0');
        if (this.dom.highscoreDisplay) this.dom.highscoreDisplay.textContent = String(this.highScore).padStart(6, '0');
        if (this.dom.epochDisplay) this.dom.epochDisplay.textContent = String(this.epoch).padStart(2, '0');
        if (this.dom.livesDisplay) this.dom.livesDisplay.textContent = String(this.lives);
        if (this.dom.lrDisplay) this.dom.lrDisplay.textContent = `${this.learningRate.toFixed(2).replace(/\.00$/, '.0')}x`;
        if (this.dom.touchLrDisplay) this.dom.touchLrDisplay.textContent = `${this.learningRate.toFixed(2).replace(/\.00$/, '.0')}x`;
    }

    bindEvents() {
        this.boundKeyHandler = (e) => this.handleKeyDown(e);
        this.boundKeyUpHandler = (e) => this.handleKeyUp(e);
        window.addEventListener('keydown', this.boundKeyHandler);
        window.addEventListener('keyup', this.boundKeyUpHandler);

        // HUD action buttons
        if (this.dom.pauseBtn) this.dom.pauseBtn.addEventListener('click', () => this.togglePause());
        if (this.dom.restartHudBtn) this.dom.restartHudBtn.addEventListener('click', () => this.restartGame());
        if (this.dom.lrDecBtn) this.dom.lrDecBtn.addEventListener('click', () => this.adjustLearningRate(-1));
        if (this.dom.lrIncBtn) this.dom.lrIncBtn.addEventListener('click', () => this.adjustLearningRate(1));

        // Overlay buttons
        if (this.dom.startBtn) this.dom.startBtn.addEventListener('click', () => this.startGame());
        if (this.dom.resumeBtn) this.dom.resumeBtn.addEventListener('click', () => this.resumeGame());
        if (this.dom.restartFromPauseBtn) this.dom.restartFromPauseBtn.addEventListener('click', () => this.restartGame());
        if (this.dom.nextEpochBtn) this.dom.nextEpochBtn.addEventListener('click', () => this.proceedToNextEpoch());
        if (this.dom.restartBtn) this.dom.restartBtn.addEventListener('click', () => this.restartGame());
        if (this.dom.exitToMenuBtn) this.dom.exitToMenuBtn.addEventListener('click', () => this.handleReturnToMenu());
        if (this.dom.backToMenuBtn) this.dom.backToMenuBtn.addEventListener('click', () => this.handleReturnToMenu());

        // Mobile touch buttons
        this.bindTouchControls();
    }

    bindTouchControls() {
        // Touch steer left/right
        const setupHoldBtn = (btn, dir) => {
            if (!btn) return;
            const onStart = (e) => {
                e.preventDefault();
                this.paddle.moveDir = dir;
            };
            const onEnd = (e) => {
                e.preventDefault();
                if (this.paddle.moveDir === dir) {
                    this.paddle.moveDir = 0;
                }
            };
            btn.addEventListener('mousedown', onStart);
            btn.addEventListener('touchstart', onStart, { passive: false });
            window.addEventListener('mouseup', onEnd);
            window.addEventListener('touchend', onEnd);

            this.touchCleanups.push(() => {
                btn.removeEventListener('mousedown', onStart);
                btn.removeEventListener('touchstart', onStart);
                window.removeEventListener('mouseup', onEnd);
                window.removeEventListener('touchend', onEnd);
            });
        };

        setupHoldBtn(this.dom.touchPaddleLeft, -1);
        setupHoldBtn(this.dom.touchPaddleRight, 1);

        if (this.dom.touchLaunch) {
            const onLaunch = (e) => {
                e.preventDefault();
                this.togglePause();
            };
            this.dom.touchLaunch.addEventListener('click', onLaunch);
            this.touchCleanups.push(() => this.dom.touchLaunch?.removeEventListener('click', onLaunch));
        }

        if (this.dom.touchLrDecBtn) {
            const onLrDec = (e) => {
                e.preventDefault();
                this.adjustLearningRate(-1);
            };
            this.dom.touchLrDecBtn.addEventListener('click', onLrDec);
            this.touchCleanups.push(() => this.dom.touchLrDecBtn?.removeEventListener('click', onLrDec));
        }

        if (this.dom.touchLrIncBtn) {
            const onLrInc = (e) => {
                e.preventDefault();
                this.adjustLearningRate(1);
            };
            this.dom.touchLrIncBtn.addEventListener('click', onLrInc);
            this.touchCleanups.push(() => this.dom.touchLrIncBtn?.removeEventListener('click', onLrInc));
        }

        // Direct drag on canvas
        if (this.canvas) {
            let isDragging = false;
            const getCanvasX = (clientX) => {
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = CANVAS_WIDTH / rect.width;
                return (clientX - rect.left) * scaleX;
            };

            const onTouchStart = (e) => {
                if (e.touches && e.touches.length > 0) {
                    isDragging = true;
                    const x = getCanvasX(e.touches[0].clientX);
                    this.paddle.targetX = x;
                    if (this.ball.isAttached && this.state === 'PLAYING') {
                        this.launchBall();
                    }
                }
            };

            const onTouchMove = (e) => {
                if (isDragging && e.touches && e.touches.length > 0) {
                    e.preventDefault();
                    const x = getCanvasX(e.touches[0].clientX);
                    this.paddle.targetX = x;
                }
            };

            const onTouchEnd = () => {
                isDragging = false;
            };

            this.canvas.addEventListener('touchstart', onTouchStart, { passive: false });
            this.canvas.addEventListener('touchmove', onTouchMove, { passive: false });
            this.canvas.addEventListener('touchend', onTouchEnd);

            this.touchCleanups.push(() => {
                this.canvas.removeEventListener('touchstart', onTouchStart);
                this.canvas.removeEventListener('touchmove', onTouchMove);
                this.canvas.removeEventListener('touchend', onTouchEnd);
            });
        }
    }

    handleKeyDown(e) {
        // Universal keybindings
        if (e.key === 'Escape') {
            e.preventDefault();
            this.handleReturnToMenu();
            return;
        }

        if (e.key === '[' || e.key === '{') {
            e.preventDefault();
            this.adjustLearningRate(-1);
            return;
        }

        if (e.key === ']' || e.key === '}') {
            e.preventDefault();
            this.adjustLearningRate(1);
            return;
        }

        if (e.key === 'r' || e.key === 'R') {
            e.preventDefault();
            this.restartGame();
            return;
        }

        if (e.key === 'p' || e.key === 'P') {
            e.preventDefault();
            this.togglePause();
            return;
        }

        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            if (this.state === 'START') {
                this.startGame();
            } else if (this.state === 'PLAYING') {
                if (this.ball.isAttached) {
                    this.launchBall();
                } else if (e.key === 'p' || e.key === 'P' || e.key === ' ') {
                    this.togglePause();
                }
            } else if (this.state === 'PAUSED') {
                this.resumeGame();
            } else if (this.state === 'CONVERGED') {
                this.proceedToNextEpoch();
            } else if (this.state === 'GAMEOVER') {
                this.restartGame();
            }
            return;
        }

        // Steer keys
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
            e.preventDefault();
            this.paddle.moveDir = -1;
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
            e.preventDefault();
            this.paddle.moveDir = 1;
        }
    }

    handleKeyUp(e) {
        if ((e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') && this.paddle.moveDir === -1) {
            this.paddle.moveDir = 0;
        } else if ((e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') && this.paddle.moveDir === 1) {
            this.paddle.moveDir = 0;
        }
    }

    handleReturnToMenu() {
        this.destroy();
        if (typeof this.onReturnToMenu === 'function') {
            this.onReturnToMenu();
        }
    }

    unbindEvents() {
        window.removeEventListener('keydown', this.boundKeyHandler);
        window.removeEventListener('keyup', this.boundKeyUpHandler);
        if (this.touchCleanups) {
            this.touchCleanups.forEach(fn => fn());
            this.touchCleanups = [];
        }
    }

    destroy() {
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }
        if (this.trap.cueTimeout) {
            clearTimeout(this.trap.cueTimeout);
            this.trap.cueTimeout = null;
        }
        this.unbindEvents();
    }

    startRenderLoop() {
        this.lastTime = performance.now();
        const loop = (currentTime) => {
            const dt = Math.min((currentTime - this.lastTime) / 1000, 0.05); // cap at 50ms
            this.lastTime = currentTime;

            if (this.state === 'PLAYING') {
                this.update(dt);
            }
            this.render();

            this.animFrameId = requestAnimationFrame(loop);
        };
        this.animFrameId = requestAnimationFrame(loop);
    }

    update(dt) {
        this.updatePaddle(dt);
        this.updateBall(dt);
        this.updateParticles(dt);
    }

    updatePaddle(dt) {
        // Learning rate affects paddle speed and friction/momentum overshoot
        // High LR (2.0x): faster speed, higher momentum (slides slightly on key release)
        // Low LR (0.5x): lower speed, high friction (stops instantly, pinpoint precision)
        const speedMultiplier = Math.sqrt(this.learningRate);
        const maxSpeed = BASE_PADDLE_SPEED * speedMultiplier;
        const acceleration = 3600 * speedMultiplier;
        const friction = Math.max(0.72, Math.min(0.95, 0.72 + (this.learningRate - 0.5) * 0.15));

        if (this.paddle.moveDir !== 0) {
            this.paddle.vx += this.paddle.moveDir * acceleration * dt;
            if (Math.abs(this.paddle.vx) > maxSpeed) {
                this.paddle.vx = Math.sign(this.paddle.vx) * maxSpeed;
            }
        } else if (this.paddle.targetX !== null && this.paddle.targetX !== undefined) {
            // Touch-drag target interpolation
            const diff = this.paddle.targetX - this.paddle.x;
            if (Math.abs(diff) > 2) {
                this.paddle.x += diff * Math.min(1, 14 * dt);
                this.paddle.vx = diff * 8;
            } else {
                this.paddle.targetX = null;
            }
        } else {
            // Apply friction damping
            this.paddle.vx *= Math.pow(friction, dt * 60);
            if (Math.abs(this.paddle.vx) < 5) this.paddle.vx = 0;
        }

        this.paddle.x += this.paddle.vx * dt;

        // Clamp paddle to canvas bounds
        const halfW = this.paddle.width / 2;
        if (this.paddle.x < halfW) {
            this.paddle.x = halfW;
            this.paddle.vx = 0;
        } else if (this.paddle.x > CANVAS_WIDTH - halfW) {
            this.paddle.x = CANVAS_WIDTH - halfW;
            this.paddle.vx = 0;
        }
    }

    updateBall(dt) {
        if (this.ball.isAttached) {
            this.ball.x = this.paddle.x;
            this.ball.y = PADDLE_Y - BALL_RADIUS - 1;
            return;
        }

        // Add to ball particle trail
        this.ball.trail.push({ x: this.ball.x, y: this.ball.y, alpha: 0.6 });
        if (this.ball.trail.length > 7) this.ball.trail.shift();

        // Move ball
        this.ball.x += this.ball.vx * dt;
        this.ball.y += this.ball.vy * dt;

        // Left / Right wall collision
        if (this.ball.x - BALL_RADIUS <= 0) {
            this.ball.x = BALL_RADIUS;
            this.ball.vx = Math.abs(this.ball.vx);
        } else if (this.ball.x + BALL_RADIUS >= CANVAS_WIDTH) {
            this.ball.x = CANVAS_WIDTH - BALL_RADIUS;
            this.ball.vx = -Math.abs(this.ball.vx);
        }

        // Top wall collision
        if (this.ball.y - BALL_RADIUS <= 0) {
            this.ball.y = BALL_RADIUS;
            this.ball.vy = Math.abs(this.ball.vy);
        }

        // Bottom wall (loss of gradient step)
        if (this.ball.y - BALL_RADIUS > CANVAS_HEIGHT) {
            this.handleBallLost();
            return;
        }

        // Paddle collision
        this.checkPaddleCollision();

        // Block collision
        this.checkBlockCollisions();
    }

    checkPaddleCollision() {
        const pLeft = this.paddle.x - this.paddle.width / 2;
        const pRight = this.paddle.x + this.paddle.width / 2;
        const pTop = this.paddle.y;
        const pBottom = this.paddle.y + this.paddle.height;

        // Check if ball intersects paddle
        if (
            this.ball.x + BALL_RADIUS >= pLeft &&
            this.ball.x - BALL_RADIUS <= pRight &&
            this.ball.y + BALL_RADIUS >= pTop &&
            this.ball.y - BALL_RADIUS <= pBottom &&
            this.ball.vy > 0
        ) {
            // Angle depends on where ball hits paddle (-1 to 1)
            const offset = (this.ball.x - this.paddle.x) / (this.paddle.width / 2);
            const clampedOffset = Math.max(-0.92, Math.min(0.92, offset));
            const maxAngle = (5 * Math.PI) / 12; // 75 degrees max deflection
            const angle = clampedOffset * maxAngle;

            const speed = this.ball.speed;
            this.ball.vx = speed * Math.sin(angle);
            this.ball.vy = -speed * Math.cos(angle);
            this.ball.y = pTop - BALL_RADIUS - 1;

            // Spawn subtle collision spark
            for (let i = 0; i < 4; i++) {
                this.particles.push({
                    x: this.ball.x,
                    y: pTop,
                    vx: (Math.random() - 0.5) * 80 + this.paddle.vx * 0.2,
                    vy: -Math.random() * 60 - 20,
                    life: 0.25,
                    maxLife: 0.25,
                    color: '#39ff14',
                    size: 2
                });
            }
        }
    }

    checkBlockCollisions() {
        for (let i = this.blocks.length - 1; i >= 0; i--) {
            const b = this.blocks[i];
            // Circle-rect intersection
            const nearestX = Math.max(b.x, Math.min(this.ball.x, b.x + b.w));
            const nearestY = Math.max(b.y, Math.min(this.ball.y, b.y + b.h));
            const dx = this.ball.x - nearestX;
            const dy = this.ball.y - nearestY;

            if (dx * dx + dy * dy < BALL_RADIUS * BALL_RADIUS) {
                // Determine collision normal
                const overlapX = (b.w / 2 + BALL_RADIUS) - Math.abs(this.ball.x - (b.x + b.w / 2));
                const overlapY = (b.h / 2 + BALL_RADIUS) - Math.abs(this.ball.y - (b.y + b.h / 2));

                if (overlapX < overlapY) {
                    this.ball.vx = -this.ball.vx;
                    this.ball.x += Math.sign(this.ball.x - (b.x + b.w / 2)) * (overlapX + 1);
                } else {
                    this.ball.vy = -this.ball.vy;
                    this.ball.y += Math.sign(this.ball.y - (b.y + b.h / 2)) * (overlapY + 1);
                }

                // Handle damage
                b.health--;
                if (b.health <= 0) {
                    // Destroy block
                    this.blocks.splice(i, 1);
                    this.blocksCleared++;
                    const pointsGained = Math.round(b.baseScore * this.learningRate);
                    this.score += pointsGained;
                    this.updateHUD();

                    // Block break particles
                    for (let p = 0; p < 8; p++) {
                        this.particles.push({
                            x: b.x + b.w / 2,
                            y: b.y + b.h / 2,
                            vx: (Math.random() - 0.5) * 140,
                            vy: (Math.random() - 0.5) * 140,
                            life: 0.35,
                            maxLife: 0.35,
                            color: b.color,
                            size: 3
                        });
                    }
                } else {
                    // Block cracked / damaged
                    b.color = '#ffffff';
                }

                // Check field clear (CONVERGENCE)
                if (this.blocks.length === 0) {
                    this.triggerConverged();
                }
                break;
            }
        }
    }

    handleBallLost() {
        this.lives--;
        this.updateHUD();

        if (this.lives <= 0) {
            this.triggerGameOver();
        } else {
            this.ball.isAttached = true;
            this.ball.x = this.paddle.x;
            this.ball.y = PADDLE_Y - BALL_RADIUS - 1;
            this.ball.vx = 0;
            this.ball.vy = 0;
            this.ball.trail = [];
            if (this.dom.touchLaunchText) this.dom.touchLaunchText.textContent = '⚡ LAUNCH';
            this.announce(`Gradient step missed. ${this.lives} attempt${this.lives === 1 ? '' : 's'} remaining.`);
        }
    }

    updateParticles(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= dt;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        // Fade ball trail
        for (let i = 0; i < this.ball.trail.length; i++) {
            this.ball.trail[i].alpha *= 0.85;
        }
    }

    render() {
        if (!this.ctx) return;
        const ctx = this.ctx;

        // Clear canvas
        ctx.fillStyle = '#0a0e14';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw loss landscape level contours in background
        this.renderLossLandscapeGrid(ctx);

        // Draw blocks
        this.renderBlocks(ctx);

        // Draw particles
        this.renderParticles(ctx);

        // Draw ball trail & ball
        this.renderBall(ctx);

        // Draw paddle
        this.renderPaddle(ctx);
    }

    renderLossLandscapeGrid(ctx) {
        ctx.save();
        ctx.strokeStyle = 'rgba(57, 255, 20, 0.05)';
        ctx.lineWidth = 1;

        // Grid lines
        for (let x = 20; x < CANVAS_WIDTH; x += 25) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, CANVAS_HEIGHT);
            ctx.stroke();
        }
        for (let y = 20; y < CANVAS_HEIGHT; y += 25) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(CANVAS_WIDTH, y);
            ctx.stroke();
        }

        // Subtly curved loss contour lines
        ctx.strokeStyle = 'rgba(0, 245, 255, 0.06)';
        for (let r = 70; r < 240; r += 45) {
            ctx.beginPath();
            ctx.ellipse(CANVAS_WIDTH / 2, 130, r * 1.3, r * 0.75, 0, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.restore();
    }

    renderBlocks(ctx) {
        ctx.save();
        for (const b of this.blocks) {
            ctx.fillStyle = b.color;
            ctx.shadowColor = b.color;
            ctx.shadowBlur = 6;
            ctx.fillRect(b.x, b.y, b.w, b.h);

            // Block inner bezel / wireframe
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.lineWidth = 1;
            ctx.strokeRect(b.x + 0.5, b.y + 0.5, b.w - 1, b.h - 1);
        }
        ctx.restore();
    }

    renderPaddle(ctx) {
        ctx.save();
        const px = this.paddle.x - this.paddle.width / 2;
        const py = this.paddle.y;

        // Optimizer paddle gradient
        const grad = ctx.createLinearGradient(px, py, px + this.paddle.width, py);
        grad.addColorStop(0, '#00f5ff');
        grad.addColorStop(0.5, '#39ff14');
        grad.addColorStop(1, '#00f5ff');

        ctx.fillStyle = grad;
        ctx.shadowColor = '#39ff14';
        ctx.shadowBlur = 10;
        ctx.fillRect(px, py, this.paddle.width, this.paddle.height);

        // Terminal cursor indicator in center of optimizer
        ctx.fillStyle = '#0a0e14';
        ctx.fillRect(this.paddle.x - 3, py + 2, 6, this.paddle.height - 4);
        ctx.restore();
    }

    renderBall(ctx) {
        ctx.save();
        // Render trail
        for (const t of this.ball.trail) {
            ctx.beginPath();
            ctx.arc(t.x, t.y, BALL_RADIUS * 0.75, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 245, 255, ${t.alpha * 0.5})`;
            ctx.fill();
        }

        // Render main ball
        ctx.beginPath();
        ctx.arc(this.ball.x, this.ball.y, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#00f5ff';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
    }

    renderParticles(ctx) {
        ctx.save();
        for (const p of this.particles) {
            const alpha = Math.max(0, p.life / p.maxLife);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = alpha;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 4;
            ctx.fillRect(p.x, p.y, p.size, p.size);
        }
        ctx.restore();
    }
}

if (typeof window !== 'undefined') {
    window.ArcadeGradientGame = ArcadeGradientGame;
}
