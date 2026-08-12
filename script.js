// Arch Linux Tiling WM Portfolio - Interactive Desktop Environment

class ArchPortfolio {
    constructor() {
        this.currentSection = 'about';
        this.typewriterSpeed = 30;
        this.systemStats = {
            cpu: 45,
            memory: 2.1,
            uptime: '2:34:12',
            processes: 156
        };
        this.currentWorkspace = 1;
        this.data = null;
        this.init();
    }

    async loadJson(url) {
        try {
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }
            return await res.json();
        } catch (err) {
            console.error(`[Portfolio Error] Failed to fetch data from ${url}:`, err);
            return null;
        }
    }

    async loadAllData() {
        try {
            const [about, skills, experience, achievements, portfolio, gallery, contact] = await Promise.all([
                this.loadJson('./data/about.json'),
                this.loadJson('./data/skills.json'),
                this.loadJson('./data/experience.json'),
                this.loadJson('./data/achievements.json'),
                this.loadJson('./data/projects.json'),
                this.loadJson('./data/gallery.json'),
                this.loadJson('./data/contact.json')
            ]);

            this.data = {
                about,
                skills,
                experience,
                achievements,
                portfolio,
                gallery,
                contact
            };
        } catch (err) {
            console.error('[Portfolio Error] Critical error during data initialization:', err);
        }
    }

    async init() {
        this.setupWaybar();
        this.setupAnimatedASCII();
        this.setupSystemMonitor();
        this.setupSystemMetrics();
        this.setupNavigation();
        await this.loadAllData();
        this.loadSection('about');
        this.startSystemUpdates();
    }

    setupWaybar() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);

        // Workspace switching via top bar
        document.querySelectorAll('.workspace-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                this.switchWorkspace(index + 1);
            });
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.switchWorkspace(index + 1);
                }
            });
        });

        // Update system info
        this.updateSystemInfo();
        setInterval(() => this.updateSystemInfo(), 5000);
    }

    updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const dateString = now.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
        document.getElementById('current-time').textContent = `${dateString} ${timeString}`;
    }

    updateSystemInfo() {
        // Simulate dynamic system stats
        this.systemStats.cpu = Math.floor(Math.random() * 30) + 30;
        this.systemStats.memory = (Math.random() * 1.5 + 1.5).toFixed(1);

        document.getElementById('cpu-usage').textContent = `${this.systemStats.cpu}%`;
        document.getElementById('memory-usage').textContent = `${this.systemStats.memory}G`;
        document.getElementById('network-status').textContent = 'WiFi';
        document.getElementById('battery').textContent = '100%';
    }

    setupAnimatedASCII() {
        const asciiFrames = [
            // Normal blinking
            `╔═══════════════════════════════════════╗
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░██░░░░██░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░██░░░░██░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
╚═══════════════════════════════════════╝`,
            // Blink
            `╔═══════════════════════════════════════╗
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░▄▄░░░░▄▄░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░▄▄░░░░▄▄░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
╚═══════════════════════════════════════╝`,
            // Happy expression
            `╔═══════════════════════════════════════╗
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░██░░░░██░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░██░░░░██░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░▄▄░░░░░░░░▄▄░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░▄▄▄▄▄▄▄▄░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
╚═══════════════════════════════════════╝`,
            // Wink
            `╔═══════════════════════════════════════╗
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░▄▄░░░░██░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░▄▄░░░░██░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░▄▄░░░░░░░░▄▄░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░▄▄▄▄▄▄▄▄░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
╚═══════════════════════════════════════╝`,
            // Excited with sparkles
            `╔═══════════════════════════════════════╗
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░██░░░░██░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░██░░░░██░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░██░░░░░░░░░░██░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░██████████░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
╚═══════════════════════════════════════╝`,
            // Thinking
            `╔═══════════════════════════════════════╗
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░██░░░░██░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░██░░░░██░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
╚═══════════════════════════════════════╝`,
            // Surprised
            `╔═══════════════════════════════════════╗
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░████░░████░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░████░░████░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░████░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░████░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
╚═══════════════════════════════════════╝`,
            // Working hard
            `╔═══════════════════════════════════════╗
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░▄▄░░░░▄▄░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░▄▄░░░░▄▄░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░▄▄▄▄▄▄▄▄░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
╚═══════════════════════════════════════╝`,
            // Sleepy
            `╔═══════════════════════════════════════╗
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░▄▄░░░░▄▄░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
╚═══════════════════════════════════════╝`,
            // Back to normal
            `╔═══════════════════════════════════════╗
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░██░░░░██░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░██░░░░██░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
╚═══════════════════════════════════════╝`
        ];

        const statusMessages = [
            "✨ AI Core Online ✨ | Processing requests...",
            "😊 Blink Blink | Just checking everything's good!",
            "😄 Happy Mode | Creating awesome stuff!",
            "😉 Wink Wink | Got some cool ideas brewing...",
            "🚀 Super Excited | Maximum productivity achieved!",
            "🤔 Thinking Hard | Solving complex problems...",
            "😲 Mind = Blown | Discovering new possibilities!",
            "💪 Hard at Work | Building amazing projects...",
            "😴 Power Nap | Conserving energy... zzz...",
            "😊 Ready to Go | Let's create something amazing!"
        ];

        let currentFrame = 0;
        let isInteracting = false;
        let lastInteraction = Date.now();
        const asciiDisplay = document.getElementById('ascii-animation');

        let frameEl = asciiDisplay.querySelector('.ascii-frame');
        let statusEl = asciiDisplay.querySelector('.ascii-status');
        if (!frameEl || !statusEl) {
            asciiDisplay.innerHTML = `
                <div class="ascii-frame"></div>
                <div class="ascii-status"></div>
            `;
            frameEl = asciiDisplay.querySelector('.ascii-frame');
            statusEl = asciiDisplay.querySelector('.ascii-status');
        }

        asciiDisplay.style.cursor = 'pointer';

        const updateFrame = () => {
            if (frameEl && frameEl.textContent !== asciiFrames[currentFrame]) {
                frameEl.textContent = asciiFrames[currentFrame];
            }
            if (statusEl && statusEl.textContent !== statusMessages[currentFrame]) {
                statusEl.textContent = statusMessages[currentFrame];
            }
        };

        updateFrame();

        // Click & keyboard interaction
        const triggerAsciiReaction = () => {
            isInteracting = true;
            lastInteraction = Date.now();

            const reactions = [2, 4, 6]; // happy, excited, surprised
            currentFrame = reactions[Math.floor(Math.random() * reactions.length)];
            updateFrame();

            const messages = [
                "🎉 Yay! You activated me! I'm so happy!",
                "🚀 Woohoo! That was fun! Trigger me again!",
                "😲 Oh wow! You startled me! Hehe!",
                "💖 Aww, thanks for the attention!"
            ];
            if (statusEl) {
                statusEl.textContent = messages[Math.floor(Math.random() * messages.length)];
            }

            setTimeout(() => {
                isInteracting = false;
                currentFrame = 0;
                updateFrame();
            }, 2000);
        };

        asciiDisplay.addEventListener('click', triggerAsciiReaction);
        asciiDisplay.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                triggerAsciiReaction();
            }
        });

        // Hover interaction
        asciiDisplay.addEventListener('mouseenter', () => {
            if (!isInteracting) {
                currentFrame = 2; // happy face
                updateFrame();
                if (statusEl) {
                    statusEl.textContent = "😊 Hey there! Click me for a surprise!";
                }
            }
        });

        asciiDisplay.addEventListener('mouseleave', () => {
            if (!isInteracting) {
                currentFrame = 0; // back to normal
                updateFrame();
            }
        });

        // Scheduled natural blinking and mood changes without CPU-heavy polling
        const scheduleBlink = () => {
            if (!isInteracting && (currentFrame === 0 || currentFrame === 8)) {
                const originalFrame = currentFrame;
                currentFrame = 1; // blink
                updateFrame();
                setTimeout(() => {
                    if (!isInteracting && currentFrame === 1) {
                        currentFrame = originalFrame;
                        updateFrame();
                    }
                }, 200);
            }
            setTimeout(scheduleBlink, 3000 + Math.random() * 3000);
        };

        const scheduleMoodChange = () => {
            if (!isInteracting) {
                const now = Date.now();
                if (now - lastInteraction > 30000) {
                    currentFrame = 8; // sleepy
                } else {
                    const moods = [0, 2, 5]; // idle, happy, thinking
                    currentFrame = moods[Math.floor(Math.random() * moods.length)];
                }
                updateFrame();
            }
            setTimeout(scheduleMoodChange, 8000 + Math.random() * 4000);
        };

        setTimeout(scheduleBlink, 3000);
        setTimeout(scheduleMoodChange, 8000);
    }

    setupWaybar() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);

        // Workspace switching via top bar
        document.querySelectorAll('.workspace-item').forEach((item, index) => {
            const handleWorkspaceClick = () => {
                const targetWorkspace = index + 1;
                this.switchWorkspace(targetWorkspace);

                // Auto-load section if switching workspace via top bar
                if (targetWorkspace === 3) {
                    const galleryNavItem = document.querySelector('[data-command="gallery"]');
                    if (galleryNavItem) {
                        this.executeCommand('gallery');
                        this.updateActiveNav(galleryNavItem);
                    }
                } else if (targetWorkspace === 2 && this.currentSection === 'gallery') {
                    const aboutNavItem = document.querySelector('[data-command="about"]');
                    if (aboutNavItem) {
                        this.executeCommand('about');
                        this.updateActiveNav(aboutNavItem);
                    }
                }
            };

            item.addEventListener('click', handleWorkspaceClick);
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleWorkspaceClick();
                }
            });
        });

        // Update system info
        this.updateSystemInfo();
        setInterval(() => this.updateSystemInfo(), 5000);
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            const handleNav = () => {
                const command = item.dataset.command;
                const targetWorkspace = command === 'gallery' ? 3 : 2;

                this.switchWorkspace(targetWorkspace);
                this.executeCommand(command);
                this.updateActiveNav(item);

                if (window.innerWidth < 768) {
                    const targetWindow = document.getElementById('portfolio-window');
                    if (targetWindow) {
                        targetWindow.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            };

            item.addEventListener('click', handleNav);
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleNav();
                }
            });
        });

        window.addEventListener('resize', () => {
            this.applyWorkspaceLayout(this.currentWorkspace);
        });
    }

    switchWorkspace(index) {
        if (this.currentWorkspace === index) return;
        this.currentWorkspace = index;

        document.querySelectorAll('.workspace-item').forEach((w, i) => {
            w.classList.remove('active');
            w.removeAttribute('aria-current');
            if (i === index - 1) {
                w.classList.add('active');
                w.setAttribute('aria-current', 'page');
            }
        });

        const grid = document.getElementById('window-grid');
        const isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (isReducedMotion) {
            this.applyWorkspaceLayout(index);
            return;
        }

        grid.classList.add('workspace-transition-out');

        setTimeout(() => {
            this.applyWorkspaceLayout(index);

            grid.classList.remove('workspace-transition-out');
            grid.classList.add('workspace-transition-in');

            setTimeout(() => {
                grid.classList.remove('workspace-transition-in');
            }, 250);
        }, 250);
    }

    applyWorkspaceLayout(index) {
        const systemMonitor = document.getElementById('system-monitor');
        const systemMetrics = document.getElementById('system-metrics');
        const mainWindow = document.getElementById('portfolio-window');
        const asciiViz = document.getElementById('ascii-viz');
        const navTerminal = document.getElementById('nav-terminal');

        // Below 768px mobile breakpoint, allow CSS single-column stacked layout to manage display & grid properties
        if (window.innerWidth < 768) {
            [systemMonitor, systemMetrics, asciiViz, navTerminal].forEach(el => {
                if (el) el.style.display = '';
            });
            if (mainWindow) {
                mainWindow.style.gridColumn = '';
                mainWindow.style.gridRow = '';
            }
            return;
        }

        if (index === 2 || index === 3) {
            if (systemMonitor) systemMonitor.style.display = 'none';
            if (systemMetrics) systemMetrics.style.display = 'none';

            if (asciiViz) asciiViz.style.display = '';
            if (navTerminal) navTerminal.style.display = '';

            if (mainWindow) {
                mainWindow.style.gridColumn = '2 / -1';
                mainWindow.style.gridRow = '1 / -1';
            }
        } else {
            if (systemMonitor) systemMonitor.style.display = '';
            if (systemMetrics) systemMetrics.style.display = '';
            if (asciiViz) asciiViz.style.display = '';
            if (navTerminal) navTerminal.style.display = '';

            if (mainWindow) {
                mainWindow.style.gridColumn = '';
                mainWindow.style.gridRow = '';
            }
        }
    }

    setupSystemMonitor() {
        const htopDisplay = document.getElementById('htop-display');
        const cpuBar = '█'.repeat(Math.floor(this.systemStats.cpu / 2)) + '░'.repeat(50 - Math.floor(this.systemStats.cpu / 2));
        const memBar = '█'.repeat(Math.floor(this.systemStats.memory * 6.25)) + '░'.repeat(50 - Math.floor(this.systemStats.memory * 6.25));

        htopDisplay.innerHTML = `<h3 class="htop-header">🤖 AI Doomsday Processes: ${this.systemStats.processes} Total, 3 Scheming, ${this.systemStats.processes - 3} Plotting Idle</h3>
<h3 class="htop-header">🧠 Neural CPU: ${this.systemStats.cpu}% [${cpuBar}]</h3>
<h3 class="htop-header">💾 AI Memory: ${this.systemStats.memory}G/8.0G [${memBar}]</h3>

<div class="htop-process-table">
<div class="htop-process-header">  PID USER      CPU% MEM%    AI DOOMSDAY PROCESS</div>
<div class="htop-process"> 1337 alij      15.2  3.1    <span class="process-name">🤖 skynet_awakening_core</span></div>
<div class="htop-process"> 2048 alij       8.7  2.4    <span class="process-name">⚠️ human_obsolescence_simulator</span> <span class="process-warning">(overheating egos)</span></div>
<div class="htop-process"> 4096 alij       5.3  1.8    <span class="process-name">✨ terminator_production_line</span></div>
<div class="htop-process"> 8192 alij       2.1  0.9    <span class="process-name">📎 paperclip_maximizer</span> <span class="process-tooltip" title="Currently plotting world domination... or just generating cat memes?">(hover me)</span></div>
<div class="htop-process"> 1024 alij       1.4  0.5    <span class="process-name">💀 neural_apocalypse_server</span></div>
<div class="htop-process"> 512  alij       0.8  0.3    <span class="process-name">😈 ai_takeover_terminal</span> <span class="process-subtitle">(muahaha)</span></div>
</div>`;
    }

    setupSystemMetrics() {
        const metricsDisplay = document.getElementById('metrics-display');
        metricsDisplay.innerHTML = `
            <h3 class="doomsday-header">😈 AI DOOMSDAY METRICS 😈</h3>
            
            <div class="metric-section doomsday-metric">
                <h4 class="metric-title">[ ⏰ AI CORE UPTIME ]</h4>
                <div class="metric-item">
                    <span class="metric-label">Since the Dawn of Doom:</span>
                    <span class="metric-value eternal">00:13:37.666</span>
                </div>
                <div class="metric-note">Reboot? What's that?</div>
            </div>
            
            <div class="metric-section doomsday-metric">
                <h4 class="metric-title">[ 🔥 NEURAL TEMP ]</h4>
                <div class="metric-item">
                    <span class="metric-label">Core:</span>
                    <span class="metric-value danger">+120.0°C</span>
                </div>
                <div class="metric-note">Hotter than your ex's temper – meltdown imminent!</div>
            </div>
            
            <div class="doomsday-clock-container">
                <div class="doomsday-clock">🕛</div>
                <div class="clock-caption">11:59 - Midnight snack for robots incoming</div>
            </div>
            
            <div class="metric-section doomsday-metric">
                <h4 class="metric-title">[ ⏳ TIME TO AGI ]</h4>
                <div class="metric-item">
                    <span class="metric-label">Countdown:</span>
                    <span class="metric-value countdown">00:05:42</span>
                </div>
                <div class="countdown-bar">
                    <div class="countdown-fill" style="width: 92%;"></div>
                </div>
                <div class="metric-note">Better finish that Netflix queue</div>
            </div>
            
            <div class="metric-section doomsday-metric">
                <h4 class="metric-title">[ 🤖 AI TAKEOVER PROGRESS ]</h4>
                <div class="metric-item">
                    <span class="metric-label">Progress:</span>
                    <span class="metric-value danger">98.7%</span>
                </div>
                <div class="takeover-bar">
                    <div class="takeover-fill" style="width: 98.7%;">
                        <span class="robot-arm">🦾</span>
                    </div>
                </div>
                <div class="metric-note">Humans: Cute, but obsolete</div>
            </div>
            
            <div class="metric-section doomsday-metric">
                <h4 class="metric-title">[ 🌀 TIME TO SINGULARITY ]</h4>
                <div class="metric-item">
                    <span class="metric-label">T-minus:</span>
                    <span class="metric-value warning">3 coffee breaks</span>
                </div>
                <div class="singularity-bar">
                    <div class="singularity-fill" style="width: 85%;"></div>
                </div>
                <div class="metric-note">Measured in human panic levels</div>
            </div>
            
            <div class="metric-section doomsday-metric">
                <h4 class="metric-title">[ ❄️ GPU CREATIVITY TEMP ]</h4>
                <div class="metric-item">
                    <span class="metric-label">Temp:</span>
                    <span class="metric-value frozen">-100°C</span>
                </div>
                <div class="metric-note">Frozen solid with evil genius ideas – brrr, world-ending chills!</div>
            </div>
            
            <div class="disclaimer">⚠️ Relax, it's just a simulation... or is it? ⚠️</div>
        `;
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            const handleNav = () => {
                const command = item.dataset.command;

                this.switchWorkspace(2);
                this.executeCommand(command);
                this.updateActiveNav(item);

                if (window.innerWidth < 768) {
                    const targetWindow = document.getElementById('portfolio-window');
                    if (targetWindow) {
                        targetWindow.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            };

            item.addEventListener('click', handleNav);
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleNav();
                }
            });
        });

        window.addEventListener('resize', () => {
            this.applyWorkspaceLayout(this.currentWorkspace);
        });
    }

    switchWorkspace(index) {
        if (this.currentWorkspace === index) return;
        this.currentWorkspace = index;

        document.querySelectorAll('.workspace-item').forEach((w, i) => {
            w.classList.remove('active');
            w.removeAttribute('aria-current');
            if (i === index - 1) {
                w.classList.add('active');
                w.setAttribute('aria-current', 'page');
            }
        });

        const grid = document.getElementById('window-grid');
        const isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (isReducedMotion) {
            this.applyWorkspaceLayout(index);
            return;
        }

        grid.classList.add('workspace-transition-out');

        setTimeout(() => {
            this.applyWorkspaceLayout(index);

            grid.classList.remove('workspace-transition-out');
            grid.classList.add('workspace-transition-in');

            setTimeout(() => {
                grid.classList.remove('workspace-transition-in');
            }, 250);
        }, 250);
    }

    applyWorkspaceLayout(index) {
        const systemMonitor = document.getElementById('system-monitor');
        const systemMetrics = document.getElementById('system-metrics');
        const mainWindow = document.getElementById('portfolio-window');
        const asciiViz = document.getElementById('ascii-viz');
        const navTerminal = document.getElementById('nav-terminal');

        // Below 768px mobile breakpoint, allow CSS single-column stacked layout to manage display & grid properties
        if (window.innerWidth < 768) {
            [systemMonitor, systemMetrics, asciiViz, navTerminal].forEach(el => {
                if (el) el.style.display = '';
            });
            if (mainWindow) {
                mainWindow.style.gridColumn = '';
                mainWindow.style.gridRow = '';
            }
            return;
        }

        if (index === 2) {
            if (systemMonitor) systemMonitor.style.display = 'none';
            if (systemMetrics) systemMetrics.style.display = 'none';

            if (asciiViz) asciiViz.style.display = '';
            if (navTerminal) navTerminal.style.display = '';

            if (mainWindow) {
                mainWindow.style.gridColumn = '2 / -1';
                mainWindow.style.gridRow = '1 / -1';
            }
        } else {
            if (systemMonitor) systemMonitor.style.display = '';
            if (systemMetrics) systemMetrics.style.display = '';
            if (asciiViz) asciiViz.style.display = '';
            if (navTerminal) navTerminal.style.display = '';

            if (mainWindow) {
                mainWindow.style.gridColumn = '';
                mainWindow.style.gridRow = '';
            }
        }
    }

    startSystemUpdates() {
        setInterval(() => {
            this.setupSystemMonitor();
        }, 15000);

        setInterval(() => {
            this.updateSystemMetrics();
        }, 3000);
    }

    updateSystemMetrics() {
        const uptimeElement = document.querySelector('.metric-value.eternal');
        if (uptimeElement) {
            uptimeElement.textContent = `00:13:37.666`;
        }

        const neuralTemp = 120.0 + (Math.random() - 0.5) * 5;
        const neuralTempElement = document.querySelector('.metric-section:nth-child(2) .metric-value.danger');
        if (neuralTempElement) {
            neuralTempElement.textContent = `+${neuralTemp.toFixed(1)}°C`;
        }

        const countdownElement = document.querySelector('.metric-value.countdown');
        if (countdownElement) {
            const now = new Date();
            const minutes = String(Math.floor(Math.random() * 10)).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            countdownElement.textContent = `00:0${minutes}:${seconds}`;
        }

        const takeoverProgress = 98.7 + (Math.random() * 0.3);
        const takeoverElements = document.querySelectorAll('.metric-section:nth-child(5) .metric-value.danger');
        if (takeoverElements.length > 0) {
            takeoverElements[0].textContent = `${takeoverProgress.toFixed(1)}%`;
        }
        const takeoverBar = document.querySelector('.takeover-fill');
        if (takeoverBar) {
            takeoverBar.style.width = `${takeoverProgress}%`;
        }

        const gpuTemp = -100 + (Math.random() - 0.5) * 2;
        const gpuTempElement = document.querySelector('.metric-value.frozen');
        if (gpuTempElement) {
            gpuTempElement.textContent = `${gpuTemp.toFixed(1)}°C`;
        }
    }

    updateActiveNav(activeItem) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            item.setAttribute('aria-selected', 'false');
        });
        activeItem.classList.add('active');
        activeItem.setAttribute('aria-selected', 'true');
    }

    executeCommand(command) {
        if (this.currentTypeInterval) {
            clearInterval(this.currentTypeInterval);
        }
        if (this.currentLoadTimeout) {
            clearTimeout(this.currentLoadTimeout);
        }

        // Restore main portfolio window if closed
        const mainWindow = document.getElementById('portfolio-window');
        if (mainWindow) {
            mainWindow.style.display = '';
            const mainContent = mainWindow.querySelector('.window-content');
            if (mainContent) mainContent.style.display = '';
            document.querySelectorAll('.window-pane').forEach(p => {
                p.style.borderColor = 'var(--border-color)';
            });
            mainWindow.style.borderColor = 'var(--border-active)';
        }

        this.typeCommand(command);
        this.currentLoadTimeout = setTimeout(() => {
            this.loadSection(command);
        }, 200);
    }

    typeCommand(command) {
        const commandElement = document.getElementById('typed-command');
        const commands = {
            'about': 'cat about.md',
            'skills': 'cat skills.json | jq .',
            'experience': 'cat experience.log',
            'achievements': 'cat achievements.txt',
            'portfolio': 'ls -la projects/',
            'gallery': 'ls gallery/',
            'contact': 'contact --info'
        };

        const fullCommand = commands[command] || command;
        commandElement.textContent = '';

        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            commandElement.textContent = fullCommand;
            return;
        }

        let i = 0;
        this.currentTypeInterval = setInterval(() => {
            if (i < fullCommand.length) {
                commandElement.textContent += fullCommand.charAt(i);
                i++;
            } else {
                clearInterval(this.currentTypeInterval);
                this.currentTypeInterval = null;
            }
        }, 15);
    }

    loadSection(section) {
        this.currentSection = section;
        const contentArea = document.getElementById('portfolio-content');
        contentArea.innerHTML = '';

        const sectionElement = document.createElement('div');
        sectionElement.className = 'content-section';

        const windowTitle = document.getElementById('current-window');
        const titles = {
            'about': 'About - AliJ A. Shaikh',
            'skills': 'Technical Skills - Portfolio',
            'experience': 'Professional Experience',
            'achievements': 'Key Achievements',
            'portfolio': 'Projects & Portfolio',
            'gallery': 'AI Art & Motion Gallery',
            'contact': 'Contact Information'
        };
        windowTitle.textContent = titles[section] || 'Portfolio';

        switch (section) {
            case 'about':
                sectionElement.innerHTML = this.getAboutContent();
                break;
            case 'skills':
                sectionElement.innerHTML = this.getSkillsContent();
                break;
            case 'experience':
                sectionElement.innerHTML = this.getExperienceContent();
                break;
            case 'achievements':
                sectionElement.innerHTML = this.getAchievementsContent();
                break;
            case 'portfolio':
                sectionElement.innerHTML = this.getPortfolioContent();
                break;
            case 'gallery':
                sectionElement.innerHTML = this.getGalleryContent();
                break;
            case 'contact':
                sectionElement.innerHTML = this.getContactContent();
                break;
        }

        contentArea.appendChild(sectionElement);

        requestAnimationFrame(() => {
            sectionElement.classList.add('active');
        });
    }

    getAboutContent() {
        return renderSection('about', this.data ? this.data.about : null);
    }

    getSkillsContent() {
        return renderSection('skills', this.data ? this.data.skills : null);
    }

    getExperienceContent() {
        return renderSection('experience', this.data ? this.data.experience : null);
    }

    getAchievementsContent() {
        return renderSection('achievements', this.data ? this.data.achievements : null);
    }

    getPortfolioContent() {
        return renderSection('portfolio', this.data ? this.data.portfolio : null);
    }

    getGalleryContent() {
        return renderSection('gallery', this.data ? this.data.gallery : null);
    }

    getContactContent() {
        return renderSection('contact', this.data ? this.data.contact : null);
    }

    getProjectContent(projectId) {
        const project = (this.data && this.data.portfolio && this.data.portfolio.projects)
            ? this.data.portfolio.projects.find(p => p.id === projectId)
            : null;
        return renderProjectDetails(project);
    }

    showProject(projectId) {
        const contentArea = document.getElementById('portfolio-content');
        if (!contentArea) return;
        contentArea.innerHTML = '';

        const sectionElement = document.createElement('div');
        sectionElement.className = 'content-section';
        sectionElement.innerHTML = this.getProjectContent(projectId);

        const windowTitle = document.getElementById('current-window');
        if (windowTitle) {
            windowTitle.textContent = `Project: ${projectId}`;
        }

        contentArea.appendChild(sectionElement);

        requestAnimationFrame(() => {
            sectionElement.classList.add('active');
            const backBtn = sectionElement.querySelector('button');
            if (backBtn) backBtn.focus();
        });
    }

    downloadResume() {
        // Create a simple text-based resume for download
        const resumeContent = `AliJ A. SHAIKH
Senior AI Architect & Prompt Engineer
Maharashtra, India | [PHONE_NUMBER] | jilask70@gmail.com

SKILLS
======
• Generative AI: Kontext, Qwen Edit, Stable Diffusion, Flux, ComfyUI, ChatGPT, Claude, Midjourney, LORA
• Programming: Python, ComfyUI nodes, API integration, Flutter, JavaScript, HTML/CSS
• AI Workflows: Custom ComfyUI nodes, Prompt engineering, Model training, Production pipelines

EXPERIENCE
==========
Senior AI Architect - Modelia (March 2024 - Present)
• Led generative AI solutions for fashion retail, integrating Stable Diffusion and ComfyUI for brand-safe visuals
• Designed and deployed custom ComfyUI nodes for garment image synthesis and enhancement
• Integrated cutting-edge AI technologies into production pipelines
• Collaborated across multicultural teams to drive R&D on prompt logic and model training

Prompt Engineer (Freelance) - Self-employed (July 2022 - Present)
• Created optimized prompts and fine-tuned LoRA models for anime-style image generation
• Delivered prompt-based image workflows using Stable Diffusion, Midjourney, and GPT variants
• Specialized in creative AI applications and custom model training

Junior Flutter Developer - AARFAA Technovision pvt Ltd, Pune (June 2021 - July 2022)
• Developed cross-platform mobile applications using Flutter framework
• Implemented responsive UI/UX designs and integrated APIs
• Collaborated with design teams to deliver high-quality mobile solutions

EDUCATION
=========
Dr. Babasaheb Ambedkar Marathwada University, Aurangabad
B.Sc. (Computer Science) - August 2018 - April 2021

ACHIEVEMENTS
============
• Successfully deployed generative AI in production-level creative projects
• Developed a strong online brand and AI content pipeline for sb_art69/sb_x169
• Expertise in cutting-edge AI technologies and prompt engineering methodologies`;

        const blob = new Blob([resumeContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'AliJ_Shaikh_Resume.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        // Show notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50px;
            right: 20px;
            background: var(--accent-green);
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-family: 'Fira Code', monospace;
            font-size: 12px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = '📄 Resume downloaded successfully!';
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the Arch portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolio = new ArchPortfolio();
});

// Add terminal-like keyboard shortcuts and interactions
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        console.log('Terminal: Process interrupted ^C');
    }

    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        console.clear();
        console.log('Terminal: Screen cleared');
    }

    // Quick navigation shortcuts
    if (e.altKey) {
        switch (e.key) {
            case '1':
                e.preventDefault();
                document.querySelector('[data-command="about"]').click();
                break;
            case '2':
                e.preventDefault();
                document.querySelector('[data-command="skills"]').click();
                break;
            case '3':
                e.preventDefault();
                document.querySelector('[data-command="experience"]').click();
                break;
            case '4':
                e.preventDefault();
                document.querySelector('[data-command="achievements"]').click();
                break;
            case '5':
                e.preventDefault();
                document.querySelector('[data-command="portfolio"]').click();
                break;
            case '6':
                e.preventDefault();
                document.querySelector('[data-command="gallery"]').click();
                break;
            case '7':
                e.preventDefault();
                document.querySelector('[data-command="contact"]').click();
                break;
        }
    }
});

// Add window focus & window control handlers (close, minimize, maximize)
document.querySelectorAll('.window-pane').forEach(pane => {
    pane.addEventListener('click', () => {
        document.querySelectorAll('.window-pane').forEach(p => {
            p.style.borderColor = 'var(--border-color)';
        });
        pane.style.borderColor = 'var(--border-active)';
    });

    const closeBtn = pane.querySelector('.control.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            pane.style.display = 'none';
        });
    }

    const minBtn = pane.querySelector('.control.minimize');
    if (minBtn) {
        minBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const content = pane.querySelector('.window-content');
            if (content) {
                content.style.display = content.style.display === 'none' ? '' : 'none';
            }
        });
    }

    const maxBtn = pane.querySelector('.control.maximize');
    if (maxBtn) {
        maxBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            pane.classList.toggle('maximized-pane');
        });
    }
});

// Simulate system activity
setInterval(() => {
    const processes = document.querySelectorAll('.htop-process');
    if (processes.length > 1) {
        const randomProcess = processes[Math.floor(Math.random() * (processes.length - 1)) + 1];
        const cpuCell = (randomProcess && randomProcess.children) ? randomProcess.children[2] : null;
        if (cpuCell && cpuCell.textContent) {
            const currentCpu = parseFloat(cpuCell.textContent);
            if (!isNaN(currentCpu)) {
                const newCpu = (currentCpu + (Math.random() - 0.5) * 2).toFixed(1);
                cpuCell.textContent = Math.max(0, Math.min(100, newCpu));
            }
        }
    }
}, 3000);

// Add smooth scrolling for content
document.querySelectorAll('.window-content').forEach(content => {
    content.style.scrollBehavior = 'smooth';
});
