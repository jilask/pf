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

        this.currentLightboxIndex = 0;
        this.currentCaseStudySubIndex = 0;
        this.lightboxItems = [];
        this.previousFocusedElement = null;
        this.isPromptExpanded = false;
        this.isPromptRevealedInModal = false;
        this.lightboxKeydownHandler = null;

        // Gallery Filter, Sort & Guess mode state
        this.galleryFilterCategory = 'all';
        this.gallerySelectedTags = new Set();
        this.gallerySortOption = 'date-desc';
        this.promptRevealMode = false;
        this.galleryPageSize = 12;
        this.galleryVisibleCount = 12;

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
        this.setupGalleryLightbox();
        await this.loadAllData();
        this.loadSection('about');
        if (typeof this.startSystemUpdates === 'function') {
            this.startSystemUpdates();
        } else if (typeof this.updateSystemMetrics === 'function') {
            this.updateSystemMetrics();
            setInterval(() => this.updateSystemMetrics(), 3000);
        }
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

    startSystemUpdates() {
        this.updateSystemMetrics();
        setInterval(() => {
            this.updateSystemMetrics();
        }, 3000);
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

    setupGalleryLightbox() {
        const closeBtn = document.getElementById('lightbox-close-btn');
        const prevBtn = document.getElementById('lightbox-prev-btn');
        const nextBtn = document.getElementById('lightbox-next-btn');
        const modal = document.getElementById('gallery-lightbox');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeGalleryLightbox());
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.navigateLightboxStep(-1));
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.navigateLightboxStep(1));
        }
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeGalleryLightbox();
                }
            });

            // Touch swipe gesture support for mobile viewers
            let touchStartX = 0;
            let touchStartY = 0;

            modal.addEventListener('touchstart', (e) => {
                if (e.touches && e.touches.length === 1) {
                    touchStartX = e.touches[0].clientX;
                    touchStartY = e.touches[0].clientY;
                }
            }, { passive: true });

            modal.addEventListener('touchend', (e) => {
                if (e.changedTouches && e.changedTouches.length === 1) {
                    const touchEndX = e.changedTouches[0].clientX;
                    const touchEndY = e.changedTouches[0].clientY;
                    const diffX = touchEndX - touchStartX;
                    const diffY = touchEndY - touchStartY;

                    // Trigger swipe if horizontal movement > 40px and dominant over vertical scroll
                    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
                        if (diffX < 0) {
                            this.navigateLightboxStep(1);  // Swipe left -> Next
                        } else {
                            this.navigateLightboxStep(-1); // Swipe right -> Prev
                        }
                    }
                }
            }, { passive: true });
        }
    }

    getAllGalleryTags() {
        if (!this.data || !this.data.gallery) return [];
        const items = Array.isArray(this.data.gallery) ? this.data.gallery : (this.data.gallery.items || []);
        const tagSet = new Set();
        items.forEach(item => {
            if (Array.isArray(item.tags)) {
                item.tags.forEach(t => tagSet.add(t));
            }
        });
        return Array.from(tagSet);
    }

    getFilteredAndSortedGalleryItems() {
        if (!this.data || !this.data.gallery) return [];
        let items = Array.isArray(this.data.gallery) ? [...this.data.gallery] : (Array.isArray(this.data.gallery.items) ? [...this.data.gallery.items] : []);

        // 1. Filter by category
        if (this.galleryFilterCategory && this.galleryFilterCategory !== 'all') {
            items = items.filter(item => (item.category || '').toLowerCase() === this.galleryFilterCategory.toLowerCase());
        }

        // 2. Filter by selected tags (multi-select filter)
        if (this.gallerySelectedTags && this.gallerySelectedTags.size > 0) {
            const selectedArr = Array.from(this.gallerySelectedTags);
            items = items.filter(item => {
                const itemTags = (item.tags || []).map(t => t.toLowerCase());
                return selectedArr.every(st => itemTags.includes(st.toLowerCase()));
            });
        }

        // 3. Sort filtered set
        if (this.gallerySortOption === 'featured-first') {
            items.sort((a, b) => {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                return new Date(b.date || 0) - new Date(a.date || 0);
            });
        } else if (this.gallerySortOption === 'date-asc') {
            items.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
        } else if (this.gallerySortOption === 'title-asc') {
            items.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        } else {
            // 'date-desc' (newest first)
            items.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
        }

        return items;
    }

    setGalleryCategory(category) {
        this.galleryFilterCategory = category || 'all';
        this.galleryVisibleCount = this.galleryPageSize;
        this.updateGalleryDisplay();
    }

    toggleGalleryTag(tag) {
        if (!tag) return;
        if (this.gallerySelectedTags.has(tag)) {
            this.gallerySelectedTags.delete(tag);
        } else {
            this.gallerySelectedTags.add(tag);
        }
        this.galleryVisibleCount = this.galleryPageSize;
        this.updateGalleryDisplay();
    }

    setGallerySort(sortOption) {
        this.gallerySortOption = sortOption || 'date-desc';
        this.galleryVisibleCount = this.galleryPageSize;
        this.updateGalleryDisplay();
    }

    loadMoreGalleryItems() {
        this.galleryVisibleCount += this.galleryPageSize;
        this.updateGalleryDisplay();
    }

    togglePromptRevealMode(enabled) {
        this.promptRevealMode = typeof enabled === 'boolean' ? enabled : !this.promptRevealMode;
        const checkbox = document.getElementById('prompt-reveal-checkbox');
        if (checkbox && checkbox.checked !== this.promptRevealMode) {
            checkbox.checked = this.promptRevealMode;
        }
    }

    resetGalleryFilters() {
        this.galleryFilterCategory = 'all';
        this.gallerySelectedTags.clear();
        this.galleryVisibleCount = this.galleryPageSize;
        this.updateGalleryDisplay();
    }

    updateGalleryDisplay() {
        const allItems = Array.isArray(this.data && this.data.gallery) ? this.data.gallery : (this.data && this.data.gallery && this.data.gallery.items ? this.data.gallery.items : []);
        const filteredItems = this.getFilteredAndSortedGalleryItems();
        const visibleItems = filteredItems.slice(0, this.galleryVisibleCount);

        // Update gallery grid in place
        const gridContainer = document.getElementById('gallery-grid');
        if (gridContainer && typeof renderGallery === 'function') {
            renderGallery(visibleItems, gridContainer, {
                category: this.galleryFilterCategory,
                tags: Array.from(this.gallerySelectedTags)
            });
        }

        // Update pagination controls in place
        const paginationWrap = document.getElementById('gallery-pagination-wrap');
        if (paginationWrap && typeof renderGalleryPagination === 'function') {
            paginationWrap.innerHTML = renderGalleryPagination(filteredItems.length, visibleItems.length);
        }

        // Update category filter buttons
        document.querySelectorAll('.gallery-filter-btn').forEach(btn => {
            const cat = btn.getAttribute('data-category');
            const isActive = cat === this.galleryFilterCategory;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        // Update tag filter chips
        document.querySelectorAll('.gallery-tag-chip').forEach(chip => {
            const tag = chip.getAttribute('data-tag');
            const isActive = this.gallerySelectedTags.has(tag);
            chip.classList.toggle('active', isActive);
            chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        // Update sort selector if value differs
        const sortSelect = document.getElementById('gallery-sort-select');
        if (sortSelect && sortSelect.value !== this.gallerySortOption) {
            sortSelect.value = this.gallerySortOption;
        }

        // Update status text
        const countStatus = document.getElementById('gallery-count-status');
        if (countStatus) {
            const hasFilters = this.galleryFilterCategory !== 'all' || this.gallerySelectedTags.size > 0;
            let filterDetails = '';
            if (hasFilters) {
                const parts = [];
                if (this.galleryFilterCategory !== 'all') parts.push(`category: ${this.galleryFilterCategory}`);
                if (this.gallerySelectedTags.size > 0) parts.push(`tags: ${Array.from(this.gallerySelectedTags).map(t => '#' + t).join(', ')}`);
                filterDetails = ` [filtered by ${parts.join(' & ')}]`;
            }
            const catalogTotalNote = filteredItems.length !== allItems.length ? ` (total in catalog: ${allItems.length})` : '';
            countStatus.innerHTML = `Showing <strong style="color: var(--accent-cyan);">${visibleItems.length}</strong> of <strong style="color: var(--accent-green);">${filteredItems.length}</strong> items${catalogTotalNote}${filterDetails}`;
        }

        // Update clear filters button
        const clearBtn = document.getElementById('clear-filters-btn');
        if (clearBtn) {
            const hasActiveFilters = this.galleryFilterCategory !== 'all' || this.gallerySelectedTags.size > 0;
            clearBtn.style.display = hasActiveFilters ? 'inline-flex' : 'none';
        }

        // If lightbox modal is currently open, close it automatically to prevent desync
        const modal = document.getElementById('gallery-lightbox');
        if (modal && !modal.hidden) {
            this.closeGalleryLightbox();
        }
    }

    async copyCurrentPrompt(btnEl) {
        if (!this.lightboxItems || !this.lightboxItems[this.currentLightboxIndex]) return;
        const item = this.lightboxItems[this.currentLightboxIndex];
        const textToCopy = item.prompt || '';
        if (!textToCopy) return;

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(textToCopy);
            } else {
                // Fallback for non-https / older browsers
                const textArea = document.createElement('textarea');
                textArea.value = textToCopy;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }

            if (btnEl) {
                const originalHtml = btnEl.innerHTML;
                btnEl.classList.add('copied');
                btnEl.innerHTML = '<span class="copy-icon" aria-hidden="true">✓</span> <span class="copy-btn-text">Copied!</span> <span class="sr-only" aria-live="polite">Prompt copied to clipboard successfully</span>';
                btnEl.setAttribute('aria-label', 'Prompt copied to clipboard!');
                setTimeout(() => {
                    btnEl.classList.remove('copied');
                    btnEl.innerHTML = originalHtml;
                    btnEl.setAttribute('aria-label', 'Copy prompt to clipboard');
                }, 1500);
            }
        } catch (err) {
            console.error('Failed to copy prompt:', err);
        }
    }

    revealPromptInLightbox(btnEl) {
        this.isPromptRevealedInModal = true;
        const guessBox = document.getElementById('prompt-guess-box');
        const promptContainer = document.getElementById('lightbox-prompt-container');
        
        if (guessBox && promptContainer) {
            guessBox.style.opacity = '0';
            guessBox.style.transform = 'translateY(-4px)';
            setTimeout(() => {
                guessBox.style.display = 'none';
                promptContainer.style.display = 'block';
                promptContainer.classList.add('prompt-revealed-anim');
            }, 150);
        } else {
            this.updateLightboxContent();
        }
    }

    openGalleryLightbox(itemId) {
        if (!this.data || !this.data.gallery) return;
        const items = this.getFilteredAndSortedGalleryItems();
        if (items.length === 0) return;

        this.lightboxItems = items;
        let index = items.findIndex(item => item.id === itemId);
        if (index === -1) index = 0;

        this.currentLightboxIndex = index;
        this.currentCaseStudySubIndex = 0;
        this.previousFocusedElement = document.activeElement;
        this.isPromptExpanded = false;
        this.isPromptRevealedInModal = false;

        this.updateLightboxContent();

        const modal = document.getElementById('gallery-lightbox');
        if (modal) {
            modal.hidden = false;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Set initial focus inside lightbox
            requestAnimationFrame(() => {
                const closeBtn = document.getElementById('lightbox-close-btn');
                if (closeBtn) {
                    closeBtn.focus();
                } else {
                    const firstFocusable = modal.querySelector('button:not([disabled]), [tabindex="0"]:not([disabled])');
                    if (firstFocusable) firstFocusable.focus();
                }
            });
        }

        if (this.lightboxKeydownHandler) {
            document.removeEventListener('keydown', this.lightboxKeydownHandler);
        }
        this.lightboxKeydownHandler = (e) => this.handleLightboxKeydown(e);
        document.addEventListener('keydown', this.lightboxKeydownHandler);
    }

    closeGalleryLightbox() {
        const modal = document.getElementById('gallery-lightbox');
        if (!modal || modal.hidden) return;

        // Pause any playing videos when closing lightbox
        const mediaWrapper = document.getElementById('lightbox-media-wrapper');
        if (mediaWrapper) {
            const video = mediaWrapper.querySelector('video');
            if (video) {
                video.pause();
            }
        }

        modal.hidden = true;
        modal.classList.remove('active');
        document.body.style.overflow = '';

        if (this.lightboxKeydownHandler) {
            document.removeEventListener('keydown', this.lightboxKeydownHandler);
            this.lightboxKeydownHandler = null;
        }

        // Return focus to originating or navigated grid thumbnail
        if (this.previousFocusedElement && typeof this.previousFocusedElement.focus === 'function') {
            this.previousFocusedElement.focus();
        }
    }

    setCaseStudySubIndex(subIndex) {
        if (!this.lightboxItems || !this.lightboxItems[this.currentLightboxIndex]) return;
        const item = this.lightboxItems[this.currentLightboxIndex];
        if (!item || !Array.isArray(item.media) || item.media.length === 0) return;

        const targetIndex = Number(subIndex);
        if (targetIndex >= 0 && targetIndex < item.media.length) {
            this.currentCaseStudySubIndex = targetIndex;
            this.updateLightboxContent();
        }
    }

    navigateLightboxStep(direction) {
        if (!this.lightboxItems || this.lightboxItems.length === 0) return;
        const currentItem = this.lightboxItems[this.currentLightboxIndex];
        const isCaseStudy = currentItem && Array.isArray(currentItem.media) && currentItem.media.length > 0;

        if (isCaseStudy) {
            const nextSub = this.currentCaseStudySubIndex + direction;
            if (nextSub >= 0 && nextSub < currentItem.media.length) {
                this.setCaseStudySubIndex(nextSub);
                return;
            }
        }

        // At sub-item boundaries or for regular single-media items, navigate between gallery entries
        this.navigateLightbox(direction);
    }

    navigateLightbox(direction) {
        if (!this.lightboxItems || this.lightboxItems.length === 0) return;

        const total = this.lightboxItems.length;
        this.currentLightboxIndex = (this.currentLightboxIndex + direction + total) % total;
        this.currentCaseStudySubIndex = 0;
        this.isPromptExpanded = false;
        this.isPromptRevealedInModal = false;
        this.updateLightboxContent();

        // Update return focus target to match newly navigated item in gallery grid
        const currentItem = this.lightboxItems[this.currentLightboxIndex];
        if (currentItem) {
            const cardEl = document.querySelector(`.gallery-card[data-id="${currentItem.id}"]`);
            if (cardEl) {
                this.previousFocusedElement = cardEl;
            }
        }
    }

    togglePromptDetails() {
        this.isPromptExpanded = !this.isPromptExpanded;
        const promptContainer = document.getElementById('lightbox-prompt-container');
        const toggleBtnText = document.getElementById('prompt-toggle-text');
        const toggleBtn = document.getElementById('prompt-toggle-btn');

        if (promptContainer) {
            if (this.isPromptExpanded) {
                promptContainer.classList.add('expanded');
            } else {
                promptContainer.classList.remove('expanded');
            }
        }
        if (toggleBtnText) {
            toggleBtnText.textContent = this.isPromptExpanded ? '▼ Hide prompt details' : '► Behind the image / Full details';
        }
        if (toggleBtn) {
            toggleBtn.setAttribute('aria-expanded', this.isPromptExpanded ? 'true' : 'false');
        }
    }

    navigateToRelatedProject(projectId) {
        this.closeGalleryLightbox();
        this.switchWorkspace(2);
        const navItem = document.querySelector('[data-command="portfolio"]');
        if (navItem) {
            this.updateActiveNav(navItem);
        }
        this.showProject(projectId);
    }

    handleLightboxKeydown(e) {
        const modal = document.getElementById('gallery-lightbox');
        if (!modal || modal.hidden) return;

        if (e.key === 'Escape') {
            e.preventDefault();
            this.closeGalleryLightbox();
            return;
        }

        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.navigateLightboxStep(-1);
            return;
        }

        if (e.key === 'ArrowRight') {
            e.preventDefault();
            this.navigateLightboxStep(1);
            return;
        }

        if (e.key === 'Tab') {
            const focusables = modal.querySelectorAll(
                'button:not([disabled]), [tabindex="0"]:not([disabled]), a[href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), video[controls]'
            );
            const focusableArray = Array.from(focusables).filter(el => {
                return el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement;
            });
            if (focusableArray.length === 0) return;

            const firstEl = focusableArray[0];
            const lastEl = focusableArray[focusableArray.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstEl || !modal.contains(document.activeElement)) {
                    e.preventDefault();
                    lastEl.focus();
                }
            } else {
                if (document.activeElement === lastEl || !modal.contains(document.activeElement)) {
                    e.preventDefault();
                    firstEl.focus();
                }
            }
        }
    }

    updateLightboxContent() {
        if (!this.lightboxItems || this.lightboxItems.length === 0) return;

        const item = this.lightboxItems[this.currentLightboxIndex];
        if (!item) return;

        const isCaseStudy = Array.isArray(item.media) && item.media.length > 0;
        let isVideo = false;
        let fullSrc = '';
        let thumbSrc = '';
        let activeCaption = '';
        let indexDisplay = '';
        let windowTitleText = '';

        if (isCaseStudy) {
            if (this.currentCaseStudySubIndex >= item.media.length) {
                this.currentCaseStudySubIndex = 0;
            }
            const subIndex = this.currentCaseStudySubIndex;
            const subItem = item.media[subIndex] || {};
            isVideo = subItem.type === 'video' || (typeof subItem.full === 'string' && subItem.full.endsWith('.mp4'));
            fullSrc = subItem.full || subItem.thumb || item.coverThumb || '';
            thumbSrc = subItem.thumb || item.coverThumb || fullSrc;
            activeCaption = subItem.caption || `View ${subIndex + 1}`;
            indexDisplay = `[${subIndex + 1}/${item.media.length}]`;
            windowTitleText = `CASE STUDY // ${item.title} // [${subIndex + 1}/${item.media.length}]`;
        } else {
            isVideo = item.mediaType === 'video';
            fullSrc = item.full || item.thumb || '';
            thumbSrc = item.thumb || fullSrc;
            activeCaption = '';
            const total = this.lightboxItems.length;
            const current = this.currentLightboxIndex + 1;
            indexDisplay = `[${current}/${total}]`;
            const fileName = (fullSrc || item.id).split('/').pop();
            windowTitleText = `VIEWER // ${fileName}`;
        }

        const modal = document.getElementById('gallery-lightbox');
        if (modal) {
            modal.setAttribute('aria-label', `Gallery Lightbox Viewer: ${item.title}${isCaseStudy ? ` - ${activeCaption}` : ''}`);
        }

        const windowTitle = document.getElementById('lightbox-window-title');
        if (windowTitle) {
            windowTitle.textContent = windowTitleText;
            windowTitle.title = windowTitleText;
        }

        const counterEl = document.getElementById('lightbox-counter');
        if (counterEl) {
            counterEl.textContent = indexDisplay;
            counterEl.setAttribute('aria-label', isCaseStudy
                ? `Sub-item ${this.currentCaseStudySubIndex + 1} of ${item.media.length} (${item.title})`
                : `Item ${this.currentLightboxIndex + 1} of ${this.lightboxItems.length}`);
        }

        const mediaWrapper = document.getElementById('lightbox-media-wrapper');
        if (mediaWrapper) {
            // Stop and clean up any existing video element
            const prevVideo = mediaWrapper.querySelector('video');
            if (prevVideo) {
                prevVideo.pause();
                prevVideo.removeAttribute('src');
                prevVideo.load();
            }

            const captionMarkup = (isCaseStudy && activeCaption) ? `
                <div class="lightbox-media-caption" role="note" aria-label="Media caption">
                    <span class="caption-icon" aria-hidden="true">▸</span>
                    <span class="caption-text">${activeCaption}</span>
                </div>
            ` : '';

            if (isVideo) {
                mediaWrapper.innerHTML = `
                    <div class="lightbox-media-main-wrap">
                        <video src="${fullSrc}" 
                               controls 
                               playsinline
                               preload="metadata"
                               class="lightbox-media-video" 
                               aria-label="${item.title} - ${activeCaption || item.tool || 'Generative AI'} video presentation">
                            Your browser does not support HTML5 video playback.
                        </video>
                        ${captionMarkup}
                    </div>
                `;
            } else {
                mediaWrapper.innerHTML = `
                    <div class="lightbox-media-main-wrap">
                        <img src="${fullSrc}" 
                             alt="${item.title} - ${activeCaption || item.tool || 'Generative AI'} artwork (full resolution)" 
                             class="lightbox-media-img"
                             onerror="this.onerror=null; this.src='${thumbSrc}';">
                        ${captionMarkup}
                    </div>
                `;
            }
        }

        // Sub-navigation thumbnail strip
        const subnavContainer = document.getElementById('lightbox-subnav-container');
        if (subnavContainer) {
            if (isCaseStudy) {
                subnavContainer.style.display = 'block';
                subnavContainer.innerHTML = `
                    <div class="lightbox-subnav-bar" role="tablist" aria-label="Case study views">
                        <span class="lightbox-subnav-label"><span class="terminal-prompt-char" aria-hidden="true">&gt;</span> VIEWS [${item.media.length}]:</span>
                        <div class="lightbox-subnav-strip">
                            ${item.media.map((sub, idx) => {
                                const isActive = idx === this.currentCaseStudySubIndex;
                                const isSubVid = sub.type === 'video' || (typeof sub.full === 'string' && sub.full.endsWith('.mp4'));
                                const subThumb = sub.thumb || item.coverThumb || sub.full;
                                const subTitle = sub.caption || `View ${idx + 1}`;
                                return `
                                    <button type="button" 
                                            role="tab"
                                            class="lightbox-subnav-item ${isActive ? 'active' : ''}${isSubVid ? ' is-video' : ''}" 
                                            aria-selected="${isActive ? 'true' : 'false'}"
                                            aria-label="View ${idx + 1} of ${item.media.length}: ${subTitle}"
                                            onclick="window.portfolio && window.portfolio.setCaseStudySubIndex(${idx})">
                                        <img src="${subThumb}" alt="" class="subnav-thumb" loading="lazy">
                                        <span class="subnav-badge" aria-hidden="true">${isSubVid ? '▶' : (idx + 1)}</span>
                                        <span class="subnav-title">${subTitle}</span>
                                    </button>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            } else {
                subnavContainer.style.display = 'none';
                subnavContainer.innerHTML = '';
            }
        }

        let relatedProjectInfo = null;
        if (item.relatedProject && this.data && this.data.portfolio && Array.isArray(this.data.portfolio.projects)) {
            relatedProjectInfo = this.data.portfolio.projects.find(p => p.id === item.relatedProject);
        }

        const isLongPrompt = item.prompt && item.prompt.length > 90;
        const promptSummary = isLongPrompt ? item.prompt.slice(0, 90) + '...' : item.prompt;
        const isConcealed = this.promptRevealMode && !this.isPromptRevealedInModal;

        const metaPanel = document.getElementById('lightbox-meta-panel');
        if (metaPanel) {
            metaPanel.innerHTML = `
                <div class="lightbox-meta-header">
                    <h3 class="lightbox-title" id="lightbox-item-title">${item.title}</h3>
                    <span class="gallery-category-badge ${item.category || 'general'}">${(item.category || 'General').toUpperCase()}</span>
                </div>

                ${isCaseStudy && activeCaption ? `
                    <div class="lightbox-subitem-info">
                        <span class="subitem-label"><span aria-hidden="true">📷</span> ACTIVE VIEW [${this.currentCaseStudySubIndex + 1}/${item.media.length}]:</span>
                        <span class="subitem-caption">${activeCaption}</span>
                    </div>
                ` : ''}

                <div class="lightbox-meta-row">
                    <span class="lightbox-meta-item">🛠️ <strong>Tool:</strong> ${item.tool || 'N/A'}</span>
                    <span class="lightbox-meta-item">📅 <strong>Date:</strong> ${item.date || 'N/A'}</span>
                </div>

                ${item.tags && item.tags.length ? `
                    <div class="lightbox-tags-container">
                        ${item.tags.map(tag => `<span class="gallery-tag">#${tag}</span>`).join('')}
                    </div>
                ` : ''}

                <div class="lightbox-prompt-section">
                    <div class="prompt-header-row">
                        <div class="prompt-label-group">
                            <span class="prompt-label">🤖 PROMPT LOGIC:</span>
                        </div>
                        <div class="prompt-actions-group">
                            <button id="copy-prompt-btn" 
                                    class="copy-prompt-btn" 
                                    type="button" 
                                    aria-label="Copy prompt to clipboard"
                                    onclick="window.portfolio && window.portfolio.copyCurrentPrompt(this)">
                                <span class="copy-icon" aria-hidden="true">📋</span> <span class="copy-btn-text">Copy prompt</span>
                            </button>
                            ${isLongPrompt || item.negativePrompt ? `
                                <button id="prompt-toggle-btn" 
                                        class="prompt-toggle-btn" 
                                        type="button" 
                                        aria-expanded="${this.isPromptExpanded ? 'true' : 'false'}"
                                        onclick="window.portfolio && window.portfolio.togglePromptDetails()">
                                    <span id="prompt-toggle-text">${this.isPromptExpanded ? '▼ Hide prompt details' : '► Behind the image / Full details'}</span>
                                </button>
                            ` : ''}
                        </div>
                    </div>

                    ${isConcealed ? `
                        <div class="prompt-guess-box" id="prompt-guess-box">
                            <div class="guess-badge">🎮 GUESS THE PROMPT MODE</div>
                            <div class="guess-instruction">Prompt hidden behind encrypted barrier. Can you deduce the generation prompt?</div>
                            <button type="button" 
                                    class="reveal-prompt-btn" 
                                    id="reveal-prompt-btn"
                                    onclick="window.portfolio && window.portfolio.revealPromptInLightbox(this)"
                                    aria-label="Reveal the hidden AI generation prompt">
                                👁️ REVEAL PROMPT // [DECRYPT]
                            </button>
                        </div>
                        <div id="lightbox-prompt-container" class="lightbox-prompt-container prompt-hidden-mode ${this.isPromptExpanded ? 'expanded' : ''}" style="display: none;">
                            <div class="prompt-text prompt-summary">${promptSummary}</div>
                            <div class="prompt-text prompt-full">${item.prompt}</div>
                            
                            ${item.negativePrompt ? `
                                <div class="negative-prompt-block">
                                    <span class="negative-prompt-label">🚫 Negative Prompt:</span>
                                    <div class="negative-prompt-text">${item.negativePrompt}</div>
                                </div>
                            ` : ''}
                        </div>
                    ` : `
                        <div id="lightbox-prompt-container" class="lightbox-prompt-container ${this.isPromptExpanded ? 'expanded' : ''}">
                            <div class="prompt-text prompt-summary">${promptSummary}</div>
                            <div class="prompt-text prompt-full">${item.prompt}</div>
                            
                            ${item.negativePrompt ? `
                                <div class="negative-prompt-block">
                                    <span class="negative-prompt-label">🚫 Negative Prompt:</span>
                                    <div class="negative-prompt-text">${item.negativePrompt}</div>
                                </div>
                            ` : ''}
                        </div>
                    `}
                </div>

                ${relatedProjectInfo ? `
                    <div class="lightbox-project-section">
                        <button type="button" 
                                class="lightbox-project-link-btn" 
                                onclick="window.portfolio && window.portfolio.navigateToRelatedProject('${item.relatedProject}')"
                                aria-label="View case study for ${relatedProjectInfo.title}">
                            <span class="project-link-icon">🔗</span> Related Project: <strong>${relatedProjectInfo.title}</strong> →
                        </button>
                    </div>
                ` : (item.relatedProject ? `
                    <div class="lightbox-project-section">
                        <button type="button" 
                                class="lightbox-project-link-btn" 
                                onclick="window.portfolio && window.portfolio.navigateToRelatedProject('${item.relatedProject}')"
                                aria-label="View case study for related project">
                            <span class="project-link-icon">🔗</span> Related Project: <strong>${item.relatedProject}</strong> →
                        </button>
                    </div>
                ` : '')}
            `;
        }
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
