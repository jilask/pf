/**
 * ArcadeStackerGame - Retro Terminal HTML5 Canvas Falling-Block Engine ("Token Stacker")
 * Workspace 5 Arcade - AliJ Portfolio
 */

const STACKER_COLS = 10;
const STACKER_ROWS = 20;

const TETROMINO_DEFINITIONS = {
    I: {
        id: 'I',
        tokenName: 'EMBEDDING',
        color: '#00f5ff',
        cssVar: '--accent-cyan',
        matrix: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
    },
    O: {
        id: 'O',
        tokenName: 'ATTENTION',
        color: '#ffb454',
        cssVar: '--accent-yellow',
        matrix: [
            [1, 1],
            [1, 1]
        ]
    },
    T: {
        id: 'T',
        tokenName: 'PROMPT',
        color: '#a855f7',
        cssVar: '--accent-purple',
        matrix: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]
        ]
    },
    S: {
        id: 'S',
        tokenName: 'WEIGHT',
        color: '#39ff14',
        cssVar: '--accent-green',
        matrix: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ]
    },
    Z: {
        id: 'Z',
        tokenName: 'BIAS',
        color: '#ff3366',
        cssVar: '--accent-red',
        matrix: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ]
    },
    J: {
        id: 'J',
        tokenName: 'KV_CACHE',
        color: '#8b5cf6',
        cssVar: '--accent-blue',
        matrix: [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0]
        ]
    },
    L: {
        id: 'L',
        tokenName: 'LOGIT',
        color: '#ff5f00',
        cssVar: '--accent-orange',
        matrix: [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ]
    }
};

class ArcadeStackerGame {
    constructor(options = {}) {
        this.canvas = document.getElementById('stacker-canvas');
        this.nextCanvas = document.getElementById('stacker-next-canvas');
        if (!this.canvas) {
            console.error('ArcadeStackerGame: #stacker-canvas element not found.');
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        this.nextCtx = this.nextCanvas ? this.nextCanvas.getContext('2d') : null;
        this.onReturnToMenu = options.onReturnToMenu || (() => {});

        this.cols = STACKER_COLS;
        this.rows = STACKER_ROWS;
        this.cellSize = 20; // 200x400 virtual resolution
        this.storageKey = 'arcade-token-stacker-highscore';

        // State: 'START' | 'PLAYING' | 'PAUSED' | 'GAMEOVER'
        this.state = 'START';
        this.grid = this.createEmptyGrid();
        this.bag = [];
        this.currentPiece = null;
        this.nextPiece = null;

        // Telemetry & metrics
        this.score = 0;
        this.linesCleared = 0;
        this.level = 0;
        this.highScore = this.loadHighScore();
        this.hasNewRecord = false;

        // Timing
        this.lastDropTime = 0;
        this.dropInterval = 800; // ms per gravity step
        this.animFrameId = null;

        // Clearing feedback animation
        this.clearingRows = [];
        this.clearAnimationTimer = 0;
        this.clearFlashDuration = 180; // ms

        // Bound event references
        this.boundKeyHandler = this.handleKeyDown.bind(this);
        this.boundRenderLoop = this.renderLoop.bind(this);

        this.initDOM();
        this.bindEvents();
        this.setupDPI();
        this.resetGameData();
        this.startRenderLoop();
    }

    createEmptyGrid() {
        return Array.from({ length: this.rows }, () => Array(this.cols).fill(null));
    }

    setupDPI() {
        const dpr = window.devicePixelRatio || 1;
        if (this.canvas && this.ctx) {
            this.canvas.width = 200 * dpr;
            this.canvas.height = 400 * dpr;
            this.ctx.resetTransform?.();
            this.ctx.scale(dpr, dpr);
        }
        if (this.nextCanvas && this.nextCtx) {
            this.nextCanvas.width = 80 * dpr;
            this.nextCanvas.height = 80 * dpr;
            this.nextCtx.resetTransform?.();
            this.nextCtx.scale(dpr, dpr);
        }
    }

    initDOM() {
        this.dom = {
            scoreDisplay: document.getElementById('stacker-score-display'),
            highscoreDisplay: document.getElementById('stacker-highscore-display'),
            linesDisplay: document.getElementById('stacker-lines-display'),
            levelDisplay: document.getElementById('stacker-level-display'),
            pauseBtn: document.getElementById('stacker-pause-btn'),
            pauseBtnText: document.getElementById('stacker-pause-btn-text'),
            restartHudBtn: document.getElementById('stacker-restart-hud-btn'),
            startOverlay: document.getElementById('stacker-start-overlay'),
            pauseOverlay: document.getElementById('stacker-pause-overlay'),
            gameoverOverlay: document.getElementById('stacker-gameover-overlay'),
            startBtn: document.getElementById('stacker-start-btn'),
            resumeBtn: document.getElementById('stacker-resume-btn'),
            restartFromPauseBtn: document.getElementById('stacker-restart-from-pause-btn'),
            restartBtn: document.getElementById('stacker-restart-btn'),
            exitToMenuBtn: document.getElementById('stacker-exit-to-menu-btn'),
            finalScoreDisplay: document.getElementById('stacker-final-score'),
            gameoverBestDisplay: document.getElementById('stacker-gameover-best'),
            gameoverLinesDisplay: document.getElementById('stacker-gameover-lines'),
            gameoverDepthDisplay: document.getElementById('stacker-gameover-depth'),
            newRecordBadge: document.getElementById('stacker-new-highscore-badge'),
            flushCue: document.getElementById('stacker-flush-cue'),
            flushCueText: document.getElementById('stacker-flush-cue-text'),
            liveAnnouncer: document.getElementById('stacker-live-announcer'),
            nextTokenName: document.getElementById('stacker-next-name'),
            bufferFill: document.getElementById('stacker-buffer-fill'),
            bufferText: document.getElementById('stacker-buffer-text'),
            statusText: document.getElementById('stacker-status-text')
        };
    }

    bindEvents() {
        window.addEventListener('keydown', this.boundKeyHandler);

        this.dom.startBtn?.addEventListener('click', () => this.startGame());
        this.dom.resumeBtn?.addEventListener('click', () => this.togglePause());
        this.dom.restartFromPauseBtn?.addEventListener('click', () => this.restartGame());
        this.dom.restartBtn?.addEventListener('click', () => this.restartGame());
        this.dom.restartHudBtn?.addEventListener('click', () => this.restartGame());
        this.dom.pauseBtn?.addEventListener('click', () => this.togglePause());
        this.dom.exitToMenuBtn?.addEventListener('click', () => this.exitToMenu());
    }

    unbindEvents() {
        window.removeEventListener('keydown', this.boundKeyHandler);
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

    refillBag() {
        const types = Object.keys(TETROMINO_DEFINITIONS);
        for (let i = types.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [types[i], types[j]] = [types[j], types[i]];
        }
        this.bag.push(...types);
    }

    getPieceFromBag() {
        if (this.bag.length === 0) {
            this.refillBag();
        }
        const type = this.bag.shift();
        const def = TETROMINO_DEFINITIONS[type];
        const theme = this.getThemeColors();
        const colorMap = {
            I: theme.cyan,
            O: theme.yellow,
            T: theme.purple,
            S: theme.green,
            Z: theme.red,
            J: theme.blue,
            L: theme.orange
        };
        return {
            id: def.id,
            tokenName: def.tokenName,
            color: colorMap[def.id] || def.color,
            cssVar: def.cssVar,
            matrix: def.matrix.map(row => [...row]),
            x: Math.floor((this.cols - def.matrix[0].length) / 2),
            y: 0
        };
    }

    resetGameData() {
        this.grid = this.createEmptyGrid();
        this.bag = [];
        this.score = 0;
        this.linesCleared = 0;
        this.level = 0;
        this.hasNewRecord = false;
        this.clearingRows = [];
        this.dropInterval = this.calculateDropInterval(this.level);

        this.currentPiece = this.getPieceFromBag();
        this.nextPiece = this.getPieceFromBag();

        this.updateHUD();
        this.updateBufferMeter();
    }

    calculateDropInterval(level) {
        // Difficulty ramp: decreases step interval from 800ms down to 100ms
        return Math.max(100, 800 - level * 70);
    }

    startGame() {
        if (this.state === 'PLAYING') return;
        this.resetGameData();
        this.state = 'PLAYING';
        this.lastDropTime = performance.now();

        if (this.dom.startOverlay) this.dom.startOverlay.style.display = 'none';
        if (this.dom.pauseOverlay) this.dom.pauseOverlay.style.display = 'none';
        if (this.dom.gameoverOverlay) this.dom.gameoverOverlay.style.display = 'none';
        if (this.dom.statusText) this.dom.statusText.textContent = 'AGENT: 0x4B3A // STATUS: BUFFER_ACTIVE';

        this.announce('Token Stacker started. Context window initialized. Use Arrow keys or WASD to navigate tokens.');
    }

    togglePause() {
        if (this.state === 'PLAYING') {
            this.state = 'PAUSED';
            if (this.dom.pauseOverlay) this.dom.pauseOverlay.style.display = 'flex';
            if (this.dom.pauseBtnText) this.dom.pauseBtnText.textContent = 'RESUME [P]';
            if (this.dom.statusText) this.dom.statusText.textContent = 'AGENT: 0x4B3A // STATUS: THREAD_SUSPENDED';
            this.dom.resumeBtn?.focus();
            this.announce('Context thread suspended.');
        } else if (this.state === 'PAUSED') {
            this.state = 'PLAYING';
            this.lastDropTime = performance.now();
            if (this.dom.pauseOverlay) this.dom.pauseOverlay.style.display = 'none';
            if (this.dom.pauseBtnText) this.dom.pauseBtnText.textContent = 'PAUSE [P]';
            if (this.dom.statusText) this.dom.statusText.textContent = 'AGENT: 0x4B3A // STATUS: BUFFER_ACTIVE';
            this.announce('Context thread resumed.');
        }
    }

    restartGame() {
        if (this.dom.pauseOverlay) this.dom.pauseOverlay.style.display = 'none';
        if (this.dom.gameoverOverlay) this.dom.gameoverOverlay.style.display = 'none';
        this.startGame();
    }

    exitToMenu() {
        this.destroy();
        this.onReturnToMenu();
    }

    // Matrix collision check
    isValidPosition(matrix, offsetX, offsetY) {
        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c] !== 0) {
                    const nextX = offsetX + c;
                    const nextY = offsetY + r;

                    // Wall boundaries
                    if (nextX < 0 || nextX >= this.cols || nextY >= this.rows) {
                        return false;
                    }
                    // Locked pieces (ignore above board)
                    if (nextY >= 0 && this.grid[nextY][nextX] !== null) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    moveLeft() {
        if (this.state !== 'PLAYING' || !this.currentPiece) return false;
        if (this.isValidPosition(this.currentPiece.matrix, this.currentPiece.x - 1, this.currentPiece.y)) {
            this.currentPiece.x--;
            return true;
        }
        return false;
    }

    moveRight() {
        if (this.state !== 'PLAYING' || !this.currentPiece) return false;
        if (this.isValidPosition(this.currentPiece.matrix, this.currentPiece.x + 1, this.currentPiece.y)) {
            this.currentPiece.x++;
            return true;
        }
        return false;
    }

    rotateMatrixClockwise(matrix) {
        const N = matrix.length;
        const result = Array.from({ length: N }, () => Array(N).fill(0));
        for (let r = 0; r < N; r++) {
            for (let c = 0; c < N; c++) {
                result[c][N - 1 - r] = matrix[r][c];
            }
        }
        return result;
    }

    rotatePiece() {
        if (this.state !== 'PLAYING' || !this.currentPiece) return false;
        const rotated = this.rotateMatrixClockwise(this.currentPiece.matrix);

        // Standard wall kick offsets: 0, -1, +1, -2, +2
        const kicks = [0, -1, 1, -2, 2];
        for (const kick of kicks) {
            if (this.isValidPosition(rotated, this.currentPiece.x + kick, this.currentPiece.y)) {
                this.currentPiece.matrix = rotated;
                this.currentPiece.x += kick;
                return true;
            }
        }
        return false;
    }

    softDrop() {
        if (this.state !== 'PLAYING' || !this.currentPiece) return false;
        if (this.isValidPosition(this.currentPiece.matrix, this.currentPiece.x, this.currentPiece.y + 1)) {
            this.currentPiece.y++;
            this.score += 1;
            this.checkHighScore();
            this.updateHUD();
            this.lastDropTime = performance.now();
            return true;
        } else {
            this.lockPiece();
            return false;
        }
    }

    hardDrop() {
        if (this.state !== 'PLAYING' || !this.currentPiece) return 0;
        let droppedCells = 0;
        while (this.isValidPosition(this.currentPiece.matrix, this.currentPiece.x, this.currentPiece.y + 1)) {
            this.currentPiece.y++;
            droppedCells++;
        }
        this.score += droppedCells * 2;
        this.checkHighScore();
        this.updateHUD();
        this.lockPiece();
        return droppedCells;
    }

    getGhostY() {
        if (!this.currentPiece) return 0;
        let ghostY = this.currentPiece.y;
        while (this.isValidPosition(this.currentPiece.matrix, this.currentPiece.x, ghostY + 1)) {
            ghostY++;
        }
        return ghostY;
    }

    lockPiece() {
        if (!this.currentPiece) return;

        const { matrix, x, y, color, cssVar, id, tokenName } = this.currentPiece;
        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c] !== 0) {
                    const boardY = y + r;
                    const boardX = x + c;
                    if (boardY >= 0 && boardY < this.rows && boardX >= 0 && boardX < this.cols) {
                        this.grid[boardY][boardX] = { color, cssVar, id, tokenName };
                    }
                }
            }
        }

        this.checkLineClears();
    }

    checkLineClears() {
        const fullRows = [];
        for (let r = 0; r < this.rows; r++) {
            if (this.grid[r].every(cell => cell !== null)) {
                fullRows.push(r);
            }
        }

        if (fullRows.length > 0) {
            this.clearingRows = fullRows;
            this.clearAnimationTimer = performance.now();

            const isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (isReducedMotion) {
                // Instantly clear row without flash animation delay
                this.finalizeLineClear(fullRows);
            }
        } else {
            this.spawnNextPiece();
        }
    }

    finalizeLineClear(fullRows) {
        const count = fullRows.length;
        // Remove cleared rows and push empty rows at top
        this.grid = this.grid.filter((_, idx) => !fullRows.includes(idx));
        while (this.grid.length < this.rows) {
            this.grid.unshift(Array(this.cols).fill(null));
        }

        this.linesCleared += count;
        this.level = Math.floor(this.linesCleared / 10);
        this.dropInterval = this.calculateDropInterval(this.level);

        // Standard Tetris scoring multiplier
        const lineScores = [0, 100, 300, 500, 800];
        const addedScore = (lineScores[count] || count * 200) * (this.level + 1);
        this.score += addedScore;

        this.checkHighScore();
        this.updateHUD();
        this.updateBufferMeter();

        // Show thematic flush cue
        this.triggerFlushCue(count);

        this.announce(`Context flushed: ${count} line${count > 1 ? 's' : ''}. Depth: ${this.level}. Tokens: ${this.score}.`);

        this.clearingRows = [];
        this.spawnNextPiece();
    }

    triggerFlushCue(count) {
        if (!this.dom.flushCue) return;
        const messages = {
            1: 'CONTEXT FLUSHED [+1]',
            2: 'BUFFER PURGED [2x]',
            3: 'MULTI-FLUSH [3x]',
            4: 'FULL CONTEXT PURGE [4x]'
        };
        if (this.dom.flushCueText) {
            this.dom.flushCueText.textContent = messages[count] || 'CONTEXT FLUSHED';
        }
        this.dom.flushCue.style.display = 'block';

        const isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const duration = isReducedMotion ? 400 : 700;

        setTimeout(() => {
            if (this.dom.flushCue) {
                this.dom.flushCue.style.display = 'none';
            }
        }, duration);
    }

    spawnNextPiece() {
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.getPieceFromBag();

        // Check spawn collision -> Context Window Overflow (Game Over)
        if (!this.isValidPosition(this.currentPiece.matrix, this.currentPiece.x, this.currentPiece.y)) {
            this.gameOver();
            return;
        }

        this.lastDropTime = performance.now();
        this.updateBufferMeter();
    }

    gameOver() {
        this.state = 'GAMEOVER';
        this.checkHighScore();

        if (this.dom.statusText) {
            this.dom.statusText.textContent = 'AGENT: 0x4B3A // STATUS: CONTEXT_OVERFLOW';
        }

        if (this.dom.finalScoreDisplay) {
            this.dom.finalScoreDisplay.textContent = String(this.score).padStart(6, '0');
        }
        if (this.dom.gameoverBestDisplay) {
            this.dom.gameoverBestDisplay.textContent = String(this.highScore).padStart(6, '0');
        }
        if (this.dom.gameoverLinesDisplay) {
            this.dom.gameoverLinesDisplay.textContent = String(this.linesCleared).padStart(2, '0');
        }
        if (this.dom.gameoverDepthDisplay) {
            this.dom.gameoverDepthDisplay.textContent = String(this.level).padStart(2, '0');
        }

        if (this.dom.newRecordBadge) {
            this.dom.newRecordBadge.style.display = this.hasNewRecord ? 'block' : 'none';
        }

        if (this.dom.gameoverOverlay) {
            this.dom.gameoverOverlay.style.display = 'flex';
        }

        this.dom.restartBtn?.focus();
        this.announce(`Context Window Overflow! Final tokens processed: ${this.score}. Context flushed: ${this.linesCleared}.`);
    }

    checkHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.hasNewRecord = true;
            this.saveHighScore(this.highScore);
            if (this.dom.highscoreDisplay) {
                this.dom.highscoreDisplay.textContent = String(this.highScore).padStart(6, '0');
            }
        }
    }

    updateHUD() {
        if (this.dom.scoreDisplay) {
            this.dom.scoreDisplay.textContent = String(this.score).padStart(6, '0');
        }
        if (this.dom.highscoreDisplay) {
            this.dom.highscoreDisplay.textContent = String(this.highScore).padStart(6, '0');
        }
        if (this.dom.linesDisplay) {
            this.dom.linesDisplay.textContent = String(this.linesCleared).padStart(2, '0');
        }
        if (this.dom.levelDisplay) {
            this.dom.levelDisplay.textContent = String(this.level).padStart(2, '0');
        }
        if (this.dom.nextTokenName && this.nextPiece) {
            this.dom.nextTokenName.textContent = this.nextPiece.tokenName;
        }
    }

    updateBufferMeter() {
        // Calculate highest filled row to estimate buffer occupancy
        let highestRow = this.rows;
        for (let r = 0; r < this.rows; r++) {
            if (this.grid[r].some(cell => cell !== null)) {
                highestRow = r;
                break;
            }
        }
        const usedLines = this.rows - highestRow;
        const percent = Math.min(100, Math.round((usedLines / this.rows) * 100));

        if (this.dom.bufferFill) {
            this.dom.bufferFill.style.height = `${percent}%`;
            if (percent > 80) {
                this.dom.bufferFill.style.background = 'var(--accent-red, #ff3366)';
                this.dom.bufferFill.style.boxShadow = '0 0 10px rgba(255, 51, 102, 0.6)';
            } else if (percent > 50) {
                this.dom.bufferFill.style.background = 'var(--accent-orange, #ff5f00)';
                this.dom.bufferFill.style.boxShadow = '0 0 10px rgba(255, 95, 0, 0.5)';
            } else {
                this.dom.bufferFill.style.background = 'var(--accent-green, #39ff14)';
                this.dom.bufferFill.style.boxShadow = '0 0 10px rgba(57, 255, 20, 0.5)';
            }
        }

        if (this.dom.bufferText) {
            this.dom.bufferText.textContent = `${usedLines} / ${this.rows} LINES (${percent}%)`;
        }
    }

    announce(text) {
        if (this.dom.liveAnnouncer) {
            this.dom.liveAnnouncer.textContent = text;
        }
    }

    handleKeyDown(e) {
        // Only process game keys if in playing or relevant overlay states
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            // Prevent page scrolling
            if (document.getElementById('arcade-window')?.style.display !== 'none') {
                e.preventDefault();
            }
        }

        if (this.state === 'START') {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.startGame();
            }
            return;
        }

        if (this.state === 'GAMEOVER') {
            if (e.key === 'r' || e.key === 'R' || e.key === 'Enter') {
                e.preventDefault();
                this.restartGame();
            }
            return;
        }

        // Pause toggle
        if (e.key === 'p' || e.key === 'P') {
            e.preventDefault();
            this.togglePause();
            return;
        }

        // Restart hotkey
        if (e.key === 'r' || e.key === 'R') {
            e.preventDefault();
            this.restartGame();
            return;
        }

        if (this.state !== 'PLAYING') return;

        switch (e.key) {
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.moveLeft();
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.moveRight();
                break;
            case 'ArrowUp':
            case 'w':
            case 'W':
                this.rotatePiece();
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                this.softDrop();
                break;
            case ' ':
                this.hardDrop();
                break;
        }
    }

    startRenderLoop() {
        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
        this.animFrameId = requestAnimationFrame(this.boundRenderLoop);
    }

    renderLoop(timestamp) {
        if (this.state === 'PLAYING') {
            // Check clearing animation completion
            if (this.clearingRows.length > 0) {
                if (timestamp - this.clearAnimationTimer >= this.clearFlashDuration) {
                    this.finalizeLineClear(this.clearingRows);
                }
            } else {
                // Gravity step
                if (timestamp - this.lastDropTime >= this.dropInterval) {
                    this.softDrop();
                    this.lastDropTime = timestamp;
                }
            }
        }

        this.drawBoard();
        this.drawNextPiece();

        this.animFrameId = requestAnimationFrame(this.boundRenderLoop);
    }

    drawBoard() {
        if (!this.ctx) return;
        const width = 200;
        const height = 400;

        // Background
        this.ctx.fillStyle = '#0a0e14';
        this.ctx.fillRect(0, 0, width, height);

        // Terminal Grid lines
        this.ctx.strokeStyle = 'rgba(57, 255, 20, 0.08)';
        this.ctx.lineWidth = 1;

        for (let x = 0; x <= width; x += this.cellSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x + 0.5, 0);
            this.ctx.lineTo(x + 0.5, height);
            this.ctx.stroke();
        }
        for (let y = 0; y <= height; y += this.cellSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y + 0.5);
            this.ctx.lineTo(width, y + 0.5);
            this.ctx.stroke();
        }

        // Draw locked cells
        for (let r = 0; r < this.rows; r++) {
            const isClearing = this.clearingRows.includes(r);
            for (let c = 0; c < this.cols; c++) {
                const cell = this.grid[r][c];
                if (cell) {
                    if (isClearing) {
                        this.drawClearingCell(c * this.cellSize, r * this.cellSize);
                    } else {
                        this.drawTokenCell(c * this.cellSize, r * this.cellSize, cell.color, cell.id);
                    }
                }
            }
        }

        // Draw Ghost piece
        if (this.state === 'PLAYING' && this.currentPiece && this.clearingRows.length === 0) {
            const ghostY = this.getGhostY();
            if (ghostY !== this.currentPiece.y) {
                this.drawGhostPiece(this.currentPiece.matrix, this.currentPiece.x, ghostY, this.currentPiece.color);
            }
        }

        // Draw Active falling piece
        if (this.state === 'PLAYING' && this.currentPiece && this.clearingRows.length === 0) {
            const { matrix, x, y, color, id } = this.currentPiece;
            for (let r = 0; r < matrix.length; r++) {
                for (let c = 0; c < matrix[r].length; c++) {
                    if (matrix[r][c] !== 0) {
                        this.drawTokenCell((x + c) * this.cellSize, (y + r) * this.cellSize, color, id);
                    }
                }
            }
        }
    }

    getThemeColors() {
        const style = (typeof window !== 'undefined' && window.getComputedStyle)
            ? window.getComputedStyle(document.documentElement)
            : null;

        const getVal = (v, fallback) => {
            if (!style) return fallback;
            const val = style.getPropertyValue(v).trim();
            return val || fallback;
        };

        return {
            cyan: getVal('--accent-cyan', '#00f5ff'),
            yellow: getVal('--accent-yellow', '#ffb454'),
            purple: getVal('--accent-purple', '#a855f7'),
            green: getVal('--accent-green', '#39ff14'),
            red: getVal('--accent-red', '#ff3366'),
            blue: getVal('--accent-blue', '#8b5cf6'),
            orange: getVal('--accent-orange', '#ff5f00')
        };
    }

    drawTokenCell(px, py, color, pieceId) {
        const size = this.cellSize;
        const inset = 1;
        const x = px + inset;
        const y = py + inset;
        const w = size - inset * 2;
        const h = size - inset * 2;

        // Base cell body with subtle token gradient (darker at bottom)
        const grad = this.ctx.createLinearGradient(x, y, x + w, y + h);
        grad.addColorStop(0, color);
        grad.addColorStop(0.65, '#0d131a');
        grad.addColorStop(1, '#05070a');

        this.ctx.fillStyle = grad;
        this.ctx.fillRect(x, y, w, h);

        // Subtle top/left light reflection highlight (token bevel)
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        this.ctx.lineWidth = 0.75;
        this.ctx.beginPath();
        this.ctx.moveTo(x + 0.5, y + h - 1);
        this.ctx.lineTo(x + 0.5, y + 0.5);
        this.ctx.lineTo(x + w - 1, y + 0.5);
        this.ctx.stroke();

        // Neon border/glow matching site aesthetic
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, w, h);

        // Token chip accent: inner subtle dot or token indicator
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.font = '700 7px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(pieceId ? `[${pieceId}]` : '•', x + w / 2, y + h / 2);
    }

    drawGhostPiece(matrix, offsetX, offsetY, color) {
        this.ctx.save();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([2, 2]);

        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c] !== 0) {
                    const x = (offsetX + c) * this.cellSize + 1.5;
                    const y = (offsetY + r) * this.cellSize + 1.5;
                    const s = this.cellSize - 3;
                    this.ctx.strokeRect(x, y, s, s);
                }
            }
        }
        this.ctx.restore();
    }

    drawClearingCell(px, py) {
        const size = this.cellSize;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowColor = '#00ffff';
        this.ctx.shadowBlur = 14;
        this.ctx.fillRect(px + 1, py + 1, size - 2, size - 2);
        this.ctx.shadowBlur = 0;
    }

    drawNextPiece() {
        if (!this.nextCtx) return;
        const w = 80;
        const h = 80;

        this.nextCtx.fillStyle = '#0a0e14';
        this.nextCtx.fillRect(0, 0, w, h);

        // Subtle terminal border
        this.nextCtx.strokeStyle = 'rgba(57, 255, 20, 0.15)';
        this.nextCtx.lineWidth = 1;
        this.nextCtx.strokeRect(0.5, 0.5, w - 1, h - 1);

        if (!this.nextPiece) return;

        const matrix = this.nextPiece.matrix;
        const rows = matrix.length;
        const cols = matrix[0].length;
        const cellSize = 15;
        const pieceW = cols * cellSize;
        const pieceH = rows * cellSize;
        const startX = Math.floor((w - pieceW) / 2);
        const startY = Math.floor((h - pieceH) / 2);

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (matrix[r][c] !== 0) {
                    const x = startX + c * cellSize + 1;
                    const y = startY + r * cellSize + 1;
                    const s = cellSize - 2;

                    const grad = this.nextCtx.createLinearGradient(x, y, x + s, y + s);
                    grad.addColorStop(0, this.nextPiece.color);
                    grad.addColorStop(1, '#05070a');

                    this.nextCtx.fillStyle = grad;
                    this.nextCtx.fillRect(x, y, s, s);

                    this.nextCtx.strokeStyle = this.nextPiece.color;
                    this.nextCtx.lineWidth = 1;
                    this.nextCtx.strokeRect(x, y, s, s);

                    this.nextCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                    this.nextCtx.font = '700 6px monospace';
                    this.nextCtx.textAlign = 'center';
                    this.nextCtx.textBaseline = 'middle';
                    this.nextCtx.fillText(this.nextPiece.id || '•', x + s / 2, y + s / 2);
                }
            }
        }
    }

    destroy() {
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }
        this.unbindEvents();
    }
}

if (typeof window !== 'undefined') {
    window.ArcadeStackerGame = ArcadeStackerGame;
}

export default ArcadeStackerGame;
