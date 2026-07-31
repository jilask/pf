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
        this.init();
    }

    init() {
        this.setupWaybar();
        this.setupAnimatedASCII();
        this.setupSystemMonitor();
        this.setupSystemMetrics();
        this.setupNavigation();
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

        // Click interaction
        asciiDisplay.addEventListener('click', () => {
            isInteracting = true;
            lastInteraction = Date.now();

            const reactions = [2, 4, 6]; // happy, excited, surprised
            currentFrame = reactions[Math.floor(Math.random() * reactions.length)];
            updateFrame();

            const messages = [
                "🎉 Yay! You clicked me! I'm so happy!",
                "🚀 Woohoo! That was fun! Click me again!",
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

    setupSystemMonitor() {
        const htopDisplay = document.getElementById('htop-display');
        const cpuBar = '█'.repeat(Math.floor(this.systemStats.cpu / 2)) + '░'.repeat(50 - Math.floor(this.systemStats.cpu / 2));
        const memBar = '█'.repeat(Math.floor(this.systemStats.memory * 6.25)) + '░'.repeat(50 - Math.floor(this.systemStats.memory * 6.25));

        htopDisplay.innerHTML = `<div class="htop-header">🤖 AI Doomsday Processes: ${this.systemStats.processes} Total, 3 Scheming, ${this.systemStats.processes - 3} Plotting Idle</div>
<div class="htop-header">🧠 Neural CPU: ${this.systemStats.cpu}% [${cpuBar}]</div>
<div class="htop-header">💾 AI Memory: ${this.systemStats.memory}G/8.0G [${memBar}]</div>

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
            <div class="doomsday-header">😈 AI DOOMSDAY METRICS 😈</div>
            
            <div class="metric-section doomsday-metric">
                <div class="metric-title">[ ⏰ AI CORE UPTIME ]</div>
                <div class="metric-item">
                    <span class="metric-label">Since the Dawn of Doom:</span>
                    <span class="metric-value eternal">00:13:37.666</span>
                </div>
                <div class="metric-note">Reboot? What's that?</div>
            </div>
            
            <div class="metric-section doomsday-metric">
                <div class="metric-title">[ 🔥 NEURAL TEMP ]</div>
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
                <div class="metric-title">[ ⏳ TIME TO AGI ]</div>
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
                <div class="metric-title">[ 🤖 AI TAKEOVER PROGRESS ]</div>
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
                <div class="metric-title">[ 🌀 TIME TO SINGULARITY ]</div>
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
                <div class="metric-title">[ ❄️ GPU CREATIVITY TEMP ]</div>
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
            item.addEventListener('click', () => {
                const command = item.dataset.command;

                this.switchWorkspace(2);
                this.executeCommand(command);
                this.updateActiveNav(item);
            });
        });
    }

    switchWorkspace(index) {
        if (this.currentWorkspace === index) return;
        this.currentWorkspace = index;

        document.querySelectorAll('.workspace-item').forEach(w => w.classList.remove('active'));
        const targetWs = document.querySelectorAll('.workspace-item')[index - 1];
        if (targetWs) targetWs.classList.add('active');

        const grid = document.getElementById('window-grid');

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
        });
        activeItem.classList.add('active');
    }

    executeCommand(command) {
        if (this.currentTypeInterval) {
            clearInterval(this.currentTypeInterval);
        }
        if (this.currentLoadTimeout) {
            clearTimeout(this.currentLoadTimeout);
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
            'contact': 'contact --info'
        };

        const fullCommand = commands[command] || command;
        commandElement.textContent = '';

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
        return `
            <div class="section-title typewriter"># About Me</div>
            <div class="terminal-text" style="margin-top: 16px;">
                <div class="command-output">
                    <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~</span><span style="color: var(--accent-yellow);">$</span> whoami
                </div>
                <p style="margin: 12px 0; font-size: 14px;">
                    <span style="color: var(--accent-cyan);">AliJ A. Shaikh</span> - Senior AI Architect & Prompt Engineer
                </p>
                <div class="command-output">
                    <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~</span><span style="color: var(--accent-yellow);">$</span> cat location.txt
                </div>
                <p style="margin: 8px 0; color: var(--text-secondary);">Maharashtra, India</p>
                
                <div class="command-output">
                    <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~</span><span style="color: var(--accent-yellow);">$</span> cat bio.md
                </div>
                <div style="margin: 12px 0; padding: 12px; background: rgba(255, 255, 255, 0.05); border-radius: 6px; border-left: 3px solid var(--accent-blue);">
                    <p style="margin-bottom: 12px; line-height: 1.6;">
                        I specialize in cutting-edge <span class="syntax-keyword">generative AI</span> technologies, with deep expertise in 
                        <span class="syntax-string">Stable Diffusion</span>, <span class="syntax-string">ComfyUI</span>, and custom AI workflows.
                    </p>
                    <p style="margin-bottom: 12px; line-height: 1.6;">
                        My passion lies in bridging the gap between complex AI systems and practical business applications.
                    </p>
                </div>
                
                <div class="command-output">
                    <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~</span><span style="color: var(--accent-yellow);">$</span> cat current_focus.json
                </div>
                <div style="margin: 12px 0; padding: 12px; background: rgba(255, 255, 255, 0.03); border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 11px;">
                    <div style="color: var(--text-secondary);">{</div>
                    <div style="margin-left: 16px;">
                        <span style="color: var(--accent-cyan);">"focus_areas"</span><span style="color: var(--text-secondary);">: [</span>
                        <div style="margin-left: 16px;">
                            <div><span style="color: var(--accent-green);">"Production-grade AI pipeline deployment"</span><span style="color: var(--text-secondary);">,</span></div>
                            <div><span style="color: var(--accent-green);">"Custom ComfyUI node development"</span><span style="color: var(--text-secondary);">,</span></div>
                            <div><span style="color: var(--accent-green);">"Brand-safe AI image generation systems"</span><span style="color: var(--text-secondary);">,</span></div>
                            <div><span style="color: var(--accent-green);">"Prompt engineering optimization"</span></div>
                        </div>
                        <span style="color: var(--text-secondary);">]</span>
                    </div>
                    <div style="color: var(--text-secondary);">}</div>
                </div>
            </div>
        `;
    }

    getSkillsContent() {
        return `
            <div class="section-title"># Technical Skills</div>
            <div class="terminal-text" style="margin-top: 16px;">
                <div class="command-output">
                    <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~</span><span style="color: var(--accent-yellow);">$</span> cat skills.json | jq .
                </div>
                <div style="margin: 12px 0; padding: 12px; background: rgba(255, 255, 255, 0.03); border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 11px;">
                    <div style="color: var(--text-secondary);">{</div>
                    <div style="margin-left: 16px;">
                        <div style="margin-bottom: 8px;">
                            <span style="color: var(--accent-cyan);">"generative_ai"</span><span style="color: var(--text-secondary);">: {</span>
                            <div style="margin-left: 16px; color: var(--accent-green);">
                                "tools": ["Stable Diffusion", "ComfyUI", "LORA", "Midjourney"],<br>
                                "models": ["GPT", "Claude", "Flux", "Kontext", "Qwen Edit"],<br>
                                "proficiency": <span style="color: var(--accent-orange);">95</span>
                            </div>
                            <span style="color: var(--text-secondary);">},</span>
                        </div>
                        <div style="margin-bottom: 8px;">
                            <span style="color: var(--accent-cyan);">"programming"</span><span style="color: var(--text-secondary);">: {</span>
                            <div style="margin-left: 16px; color: var(--accent-green);">
                                "languages": ["Python", "JavaScript", "Dart"],<br>
                                "frameworks": ["Flutter", "FastAPI", "React"],<br>
                                "proficiency": <span style="color: var(--accent-orange);">90</span>
                            </div>
                            <span style="color: var(--text-secondary);">},</span>
                        </div>
                        <div style="margin-bottom: 8px;">
                            <span style="color: var(--accent-cyan);">"ai_workflows"</span><span style="color: var(--text-secondary);">: {</span>
                            <div style="margin-left: 16px; color: var(--accent-green);">
                                "specialties": ["Custom ComfyUI Nodes", "Prompt Engineering"],<br>
                                "deployment": ["Production Pipelines", "API Integration"],<br>
                                "proficiency": <span style="color: var(--accent-orange);">98</span>
                            </div>
                            <span style="color: var(--text-secondary);">}</span>
                        </div>
                    </div>
                    <div style="color: var(--text-secondary);">}</div>
                </div>
                
                <div class="command-output">
                    <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~</span><span style="color: var(--accent-yellow);">$</span> ./skill_proficiency.sh
                </div>
                <div style="margin: 12px 0;">
                    <div style="margin-bottom: 8px;">
                        <span style="color: var(--accent-cyan);">Generative AI:</span>
                        <div class="progress-bar" style="margin-top: 4px;">
                            <div class="progress-fill" style="width: 95%;"></div>
                        </div>
                        <span style="color: var(--text-dim); font-size: 10px;">95%</span>
                    </div>
                    <div style="margin-bottom: 8px;">
                        <span style="color: var(--accent-cyan);">Python Development:</span>
                        <div class="progress-bar" style="margin-top: 4px;">
                            <div class="progress-fill" style="width: 90%;"></div>
                        </div>
                        <span style="color: var(--text-dim); font-size: 10px;">90%</span>
                    </div>
                    <div style="margin-bottom: 8px;">
                        <span style="color: var(--accent-cyan);">Prompt Engineering:</span>
                        <div class="progress-bar" style="margin-top: 4px;">
                            <div class="progress-fill" style="width: 98%;"></div>
                        </div>
                        <span style="color: var(--text-dim); font-size: 10px;">98%</span>
                    </div>
                    <div style="margin-bottom: 8px;">
                        <span style="color: var(--accent-cyan);">AI Pipeline Deployment:</span>
                        <div class="progress-bar" style="margin-top: 4px;">
                            <div class="progress-fill" style="width: 88%;"></div>
                        </div>
                        <span style="color: var(--text-dim); font-size: 10px;">88%</span>
                    </div>
                </div>
            </div>
        `;
    }

    getExperienceContent() {
        return `
            <div class="section-title"># Professional Experience</div>
            <div class="terminal-text" style="margin-top: 16px;">
                <div class="command-output">
                    <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~</span><span style="color: var(--accent-yellow);">$</span> cat experience.log
                </div>
                
                <div class="experience-item">
                    <div class="job-title">🚀 Senior AI Architect</div>
                    <div class="company" style="color: var(--accent-red); font-weight: 600;">@ Modelia</div>
                    <div class="duration">March 2024 – Present</div>
                    <div class="job-description">
                        <div style="margin-bottom: 4px;"><span style="color: var(--accent-green);">→</span> Led generative AI solutions for fashion retail, integrating Stable Diffusion and ComfyUI</div>
                        <div style="margin-bottom: 4px;"><span style="color: var(--accent-green);">→</span> Designed and deployed custom ComfyUI nodes for garment image synthesis</div>
                        <div style="margin-bottom: 4px;"><span style="color: var(--accent-green);">→</span> Integrated cutting-edge AI technologies into production pipelines</div>
                        <div><span style="color: var(--accent-green);">→</span> Collaborated across multicultural teams to drive R&D on prompt logic</div>
                    </div>
                </div>
                
                <div class="experience-item">
                    <div class="job-title">💡 Prompt Engineer (Freelance)</div>
                    <div class="company" style="color: var(--accent-purple); font-weight: 600;">@ Self-employed</div>
                    <div class="duration">July 2022 – Present</div>
                    <div class="job-description">
                        <div style="margin-bottom: 4px;"><span style="color: var(--accent-green);">→</span> Created optimized prompts and fine-tuned LoRA models for anime-style generation</div>
                        <div style="margin-bottom: 4px;"><span style="color: var(--accent-green);">→</span> Delivered prompt-based workflows using Stable Diffusion, Midjourney, GPT variants</div>
                        <div><span style="color: var(--accent-green);">→</span> Specialized in creative AI applications and custom model training</div>
                    </div>
                </div>
                
                <div class="experience-item">
                    <div class="job-title">📱 Junior Flutter Developer</div>
                    <div class="company" style="color: var(--accent-orange); font-weight: 600;">@ AARFAA Technovision pvt Ltd, Pune</div>
                    <div class="duration">June 2021 – July 2022</div>
                    <div class="job-description">
                        <div style="margin-bottom: 4px;"><span style="color: var(--accent-green);">→</span> Developed cross-platform mobile applications using Flutter framework</div>
                        <div style="margin-bottom: 4px;"><span style="color: var(--accent-green);">→</span> Implemented responsive UI/UX designs and integrated APIs</div>
                        <div><span style="color: var(--accent-green);">→</span> Collaborated with design teams to deliver high-quality mobile solutions</div>
                    </div>
                </div>
                
                <div class="command-output" style="margin-top: 16px;">
                    <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~</span><span style="color: var(--accent-yellow);">$</span> echo "Total experience: 3+ years"
                </div>
                <div style="color: var(--accent-cyan); margin: 8px 0;">Total experience: 3+ years</div>
            </div>
        `;
    }

    getAchievementsContent() {
        return `
            <div class="section-title"># Key Achievements</div>
            <div class="terminal-text" style="margin-top: 16px;">
                <div class="command-output">
                    <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~</span><span style="color: var(--accent-yellow);">$</span> cat achievements.txt
                </div>
                
                <div style="margin: 12px 0;">
                    <div style="color: var(--accent-cyan); margin-bottom: 8px;">[SUCCESS] 🚀 Production AI Deployment</div>
                    <div style="padding-left: 16px; color: var(--text-secondary); margin-bottom: 12px; font-size: 12px;">
                        Successfully deployed generative AI pipelines for fashion retail industry, achieving production-grade performance and reliability.
                    </div>
                    
                    <div style="color: var(--accent-green); margin-bottom: 8px;">[SUCCESS] 🛡️ Brand-Safe AI Systems</div>
                    <div style="padding-left: 16px; color: var(--text-secondary); margin-bottom: 12px; font-size: 12px;">
                        Developed comprehensive brand-safe AI image generation systems, ensuring content compliance and quality control.
                    </div>
                    
                    <div style="color: var(--accent-yellow); margin-bottom: 8px;">[SUCCESS] 🎨 Creative AI Solutions</div>
                    <div style="padding-left: 16px; color: var(--text-secondary); margin-bottom: 12px; font-size: 12px;">
                        Developed innovative AI-driven content creation systems leveraging advanced prompt engineering and automated workflows.
                    </div>
                    
                    <div style="color: var(--accent-purple); margin-bottom: 8px;">[SUCCESS] ⚙️ Custom ComfyUI Development</div>
                    <div style="padding-left: 16px; color: var(--text-secondary); margin-bottom: 12px; font-size: 12px;">
                        Specialized in developing custom ComfyUI nodes and workflows, extending the platform's capabilities for specific use cases.
                    </div>
                </div>
                
                <div class="command-output">
                    <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~</span><span style="color: var(--accent-yellow);">$</span> ./impact_metrics.sh
                </div>
                
                <div style="margin: 12px 0; padding: 12px; background: rgba(255, 255, 255, 0.03); border-radius: 6px;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 16px; text-align: center;">
                        <div>
                            <div style="color: var(--accent-green); font-size: 20px; font-weight: 600;">3+</div>
                            <div style="color: var(--text-dim); font-size: 10px;">Years Experience</div>
                        </div>
                        <div>
                            <div style="color: var(--accent-cyan); font-size: 20px; font-weight: 600;">50+</div>
                            <div style="color: var(--text-dim); font-size: 10px;">Projects Completed</div>
                        </div>
                        <div>
                            <div style="color: var(--accent-purple); font-size: 20px; font-weight: 600;">100%</div>
                            <div style="color: var(--text-dim); font-size: 10px;">Client Satisfaction</div>
                        </div>
                        <div>
                            <div style="color: var(--accent-yellow); font-size: 20px; font-weight: 600;">24/7</div>
                            <div style="color: var(--text-dim); font-size: 10px;">AI Systems Uptime</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getPortfolioContent() {
        return `
            <div class="section-title"># Projects & Portfolio</div>
            <div class="terminal-text" style="margin-top: 16px;">
                <div class="command-output">
                    <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~</span><span style="color: var(--accent-yellow);">$</span> ls -la projects/
                </div>
                
                <div style="margin: 12px 0; font-family: 'Fira Code', monospace; font-size: 11px;">
                    <div style="color: var(--text-secondary); margin-bottom: 8px;">total 4</div>
                    <div style="display: grid; gap: 4px;">
                        <div style="display: grid; grid-template-columns: auto auto auto 1fr; gap: 8px; align-items: center;">
                            <span style="color: var(--accent-blue);">drwxr-xr-x</span>
                            <span style="color: var(--text-secondary);">2</span>
                            <span style="color: var(--accent-green);">alij</span>
                            <span style="color: var(--accent-cyan);">ai_fashion_pipeline/</span>
                        </div>
                        <div style="display: grid; grid-template-columns: auto auto auto 1fr; gap: 8px; align-items: center;">
                            <span style="color: var(--accent-blue);">drwxr-xr-x</span>
                            <span style="color: var(--text-secondary);">2</span>
                            <span style="color: var(--accent-green);">alij</span>
                            <span style="color: var(--accent-cyan);">sb_art69_brand/</span>
                        </div>
                        <div style="display: grid; grid-template-columns: auto auto auto 1fr; gap: 8px; align-items: center;">
                            <span style="color: var(--accent-blue);">drwxr-xr-x</span>
                            <span style="color: var(--text-secondary);">2</span>
                            <span style="color: var(--accent-green);">alij</span>
                            <span style="color: var(--accent-cyan);">comfyui_custom_nodes/</span>
                        </div>
                        <div style="display: grid; grid-template-columns: auto auto auto 1fr; gap: 8px; align-items: center;">
                            <span style="color: var(--accent-blue);">drwxr-xr-x</span>
                            <span style="color: var(--text-secondary);">2</span>
                            <span style="color: var(--accent-green);">alij</span>
                            <span style="color: var(--accent-cyan);">flutter_apps/</span>
                        </div>
                    </div>
                </div>
                
                <div class="portfolio-grid" style="margin-top: 16px;">
                    <div class="portfolio-item" onclick="window.portfolio.showProject('ai-fashion')">
                        <div class="portfolio-image">🤖</div>
                        <div class="portfolio-content">
                            <div class="portfolio-title">AI Fashion Pipeline</div>
                            <div class="portfolio-description">
                                Production-grade generative AI system for fashion retail, featuring custom ComfyUI workflows and brand-safe content generation.
                            </div>
                            <div style="margin-top: 8px; color: var(--accent-blue); font-size: 10px;">Click to view details →</div>
                        </div>
                    </div>
                    
                    <div class="portfolio-item" onclick="window.portfolio.showProject('ai-content')">
                        <div class="portfolio-image">🎨</div>
                        <div class="portfolio-content">
                            <div class="portfolio-title">AI Content Creation</div>
                            <div class="portfolio-description">
                                Advanced AI-driven content creation system with innovative prompt engineering techniques and automated workflows.
                            </div>
                            <div style="margin-top: 8px; color: var(--accent-blue); font-size: 10px;">Click to view details →</div>
                        </div>
                    </div>
                    
                    <div class="portfolio-item" onclick="window.portfolio.showProject('comfyui-nodes')">
                        <div class="portfolio-image">⚙️</div>
                        <div class="portfolio-content">
                            <div class="portfolio-title">Custom ComfyUI Nodes</div>
                            <div class="portfolio-description">
                                Specialized node development extending ComfyUI capabilities for advanced AI image generation workflows.
                            </div>
                            <div style="margin-top: 8px; color: var(--accent-blue); font-size: 10px;">Click to view details →</div>
                        </div>
                    </div>
                    
                    <div class="portfolio-item" onclick="window.portfolio.showProject('flutter-apps')">
                        <div class="portfolio-image">📱</div>
                        <div class="portfolio-content">
                            <div class="portfolio-title">Flutter Applications</div>
                            <div class="portfolio-description">
                                Cross-platform mobile applications with responsive design and seamless user experience.
                            </div>
                            <div style="margin-top: 8px; color: var(--accent-blue); font-size: 10px;">Click to view details →</div>
                        </div>
                    </div>
                </div>
                
                <div class="command-output" style="margin-top: 16px;">
                    <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~</span><span style="color: var(--accent-yellow);">$</span> cat tech_stack.txt
                </div>
                <div style="margin: 12px 0; display: flex; flex-wrap: wrap; gap: 6px;">
                    ${['Python', 'ComfyUI', 'Stable Diffusion', 'Flutter', 'JavaScript', 'API Integration', 'Prompt Engineering', 'AI Workflows']
                .map(tech => `<span style="background: rgba(152, 195, 121, 0.2); padding: 4px 8px; border-radius: 12px; font-size: 10px; color: var(--accent-green); border: 1px solid var(--accent-green);">${tech}</span>`)
                .join('')}
                </div>
            </div>
        `;
    }

    getContactContent() {
        return `
            <div class="section-title"># Contact Information</div>
            <div class="terminal-text" style="margin-top: 16px;">
                <div class="command-output">
                    <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~</span><span style="color: var(--accent-yellow);">$</span> contact --info
                </div>
                
                <div style="margin: 12px 0; padding: 12px; background: rgba(255, 255, 255, 0.03); border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 11px;">
                    <div style="color: var(--text-secondary);"># Contact Details</div>
                    <div style="margin: 8px 0;">
                        <span style="color: var(--accent-cyan);">EMAIL:</span> <span style="color: var(--accent-green);">jilask70@gmail.com</span>
                    </div>
                    <div style="margin: 8px 0;">
                        <span style="color: var(--accent-cyan);">PHONE:</span> <span style="color: var(--accent-green);">[PHONE_NUMBER]</span>
                    </div>
                    <div style="margin: 8px 0;">
                        <span style="color: var(--accent-cyan);">LOCATION:</span> <span style="color: var(--accent-green);">Maharashtra, India</span>
                    </div>
                    <div style="margin: 8px 0;">
                        <span style="color: var(--accent-cyan);">TIMEZONE:</span> <span style="color: var(--accent-green);">IST (UTC+5:30)</span>
                    </div>
                </div>
                
                <div class="command-output">
                    <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~</span><span style="color: var(--accent-yellow);">$</span> cat social_links.txt
                </div>
                
                <div class="contact-grid" style="margin-top: 12px;">
                    <a href="mailto:jilask70@gmail.com" class="contact-item">
                        <div class="contact-icon">📧</div>
                        <div class="contact-label">Email</div>
                        <div class="contact-value">jilask70@gmail.com</div>
                    </a>
                    
                    <a href="#" class="contact-item">
                        <div class="contact-icon">📱</div>
                        <div class="contact-label">Phone</div>
                        <div class="contact-value">[PHONE_NUMBER]</div>
                    </a>
                    
                    <a href="https://github.com/aler69" target="_blank" class="contact-item">
                        <div class="contact-icon">💻</div>
                        <div class="contact-label">GitHub</div>
                        <div class="contact-value">github.com/aler69</div>
                    </a>
                    
                    <a href="https://www.linkedin.com/in/alij-shaikh-1311a3211/" target="_blank" class="contact-item">
                        <div class="contact-icon">💼</div>
                        <div class="contact-label">LinkedIn</div>
                        <div class="contact-value">linkedin.com/in/alij-shaikh-1311a3211</div>
                    </a>
                </div>
                
                <div class="command-output" style="margin-top: 16px;">
                    <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~</span><span style="color: var(--accent-yellow);">$</span> echo "Status: Available for collaboration"
                </div>
                <div style="margin: 12px 0; text-align: center; padding: 16px; background: rgba(97, 175, 239, 0.1); border-radius: 6px; border: 1px solid var(--accent-blue);">
                    <div style="color: var(--accent-cyan); font-weight: 600; margin-bottom: 8px;">Let's Connect!</div>
                    <div style="color: var(--text-secondary); font-size: 12px; margin-bottom: 12px;">
                        I'm always interested in discussing AI projects, prompt engineering challenges, and innovative technology solutions.
                    </div>
                    <div style="display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;">
                        <span style="background: rgba(152, 195, 121, 0.2); padding: 4px 12px; border-radius: 12px; font-size: 10px; color: var(--accent-green); border: 1px solid var(--accent-green);">Available for Freelance</span>
                        <span style="background: rgba(198, 120, 221, 0.2); padding: 4px 12px; border-radius: 12px; font-size: 10px; color: var(--accent-purple); border: 1px solid var(--accent-purple);">Open to Collaboration</span>
                    </div>
                </div>
            </div>
        `;
    }

    updateActiveNav(activeItem) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        activeItem.classList.add('active');
    }
    showProject(projectId) {
        const contentArea = document.getElementById('portfolio-content');
        contentArea.innerHTML = '';

        const sectionElement = document.createElement('div');
        sectionElement.className = 'content-section';

        // Update window title
        const windowTitle = document.getElementById('current-window');
        windowTitle.textContent = `Project Details - ${projectId}`;

        sectionElement.innerHTML = this.getProjectContent(projectId);
        contentArea.appendChild(sectionElement);

        requestAnimationFrame(() => {
            sectionElement.classList.add('active');
        });
    }

    getProjectContent(projectId) {
        const projects = {
            'ai-fashion': {
                title: 'AI Fashion Pipeline',
                icon: '🤖',
                description: 'Production-grade generative AI system for fashion retail',
                details: `
                    <div class="command-output">
                        <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~/projects</span><span style="color: var(--accent-yellow);">$</span> cat ai_fashion_pipeline/README.md
                    </div>
                    <div style="margin: 16px 0; padding: 16px; background: rgba(255, 255, 255, 0.05); border-radius: 6px; border-left: 3px solid var(--accent-blue);">
                        <h3 style="color: var(--accent-cyan); margin-bottom: 12px;">🤖 AI Fashion Pipeline</h3>
                        <p style="margin-bottom: 12px; line-height: 1.6;">
                            A comprehensive production-grade generative AI system designed specifically for the fashion retail industry.
                        </p>
                        <div style="margin-bottom: 16px;">
                            <div style="color: var(--accent-yellow); font-weight: 600; margin-bottom: 8px;">Key Features:</div>
                            <ul style="list-style: none; padding: 0;">
                                <li style="margin-bottom: 6px;"><span style="color: var(--accent-green);">✓</span> Custom ComfyUI workflows for fashion imagery</li>
                                <li style="margin-bottom: 6px;"><span style="color: var(--accent-green);">✓</span> Brand-safe content generation with quality control</li>
                                <li style="margin-bottom: 6px;"><span style="color: var(--accent-green);">✓</span> Automated batch processing capabilities</li>
                                <li style="margin-bottom: 6px;"><span style="color: var(--accent-green);">✓</span> Real-time API integration for e-commerce platforms</li>
                                <li style="margin-bottom: 6px;"><span style="color: var(--accent-green);">✓</span> Advanced prompt engineering for consistent results</li>
                            </ul>
                        </div>
                        <div style="margin-bottom: 16px;">
                            <div style="color: var(--accent-yellow); font-weight: 600; margin-bottom: 8px;">Technologies Used:</div>
                            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                                ${['Python', 'ComfyUI', 'Stable Diffusion', 'FastAPI', 'Docker', 'Redis', 'PostgreSQL']
                        .map(tech => `<span style="background: rgba(152, 195, 121, 0.2); padding: 4px 8px; border-radius: 12px; font-size: 10px; color: var(--accent-green); border: 1px solid var(--accent-green);">${tech}</span>`)
                        .join('')}
                            </div>
                        </div>
                        <div>
                            <div style="color: var(--accent-yellow); font-weight: 600; margin-bottom: 8px;">Impact:</div>
                            <p style="color: var(--text-secondary); font-size: 12px; line-height: 1.5;">
                                Successfully deployed in production environment, processing 1000+ fashion images daily with 99.9% uptime. 
                                Reduced content creation time by 80% while maintaining brand consistency and quality standards.
                            </p>
                        </div>
                    </div>
                `
            },
            'ai-content': {
                title: 'AI Content Creation System',
                icon: '🎨',
                description: 'Advanced AI-driven content creation platform',
                details: `
                    <div class="command-output">
                        <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~/projects</span><span style="color: var(--accent-yellow);">$</span> cat ai_content_system/README.md
                    </div>
                    <div style="margin: 16px 0; padding: 16px; background: rgba(255, 255, 255, 0.05); border-radius: 6px; border-left: 3px solid var(--accent-purple);">
                        <h3 style="color: var(--accent-cyan); margin-bottom: 12px;">🎨 AI Content Creation System</h3>
                        <p style="margin-bottom: 12px; line-height: 1.6;">
                            Innovative AI-driven content creation platform with advanced prompt engineering and automated workflow management.
                        </p>
                        <div style="margin-bottom: 16px;">
                            <div style="color: var(--accent-yellow); font-weight: 600; margin-bottom: 8px;">Key Features:</div>
                            <ul style="list-style: none; padding: 0;">
                                <li style="margin-bottom: 6px;"><span style="color: var(--accent-green);">✓</span> Multi-modal content generation (text, images, video)</li>
                                <li style="margin-bottom: 6px;"><span style="color: var(--accent-green);">✓</span> Advanced prompt optimization algorithms</li>
                                <li style="margin-bottom: 6px;"><span style="color: var(--accent-green);">✓</span> Automated content scheduling and publishing</li>
                                <li style="margin-bottom: 6px;"><span style="color: var(--accent-green);">✓</span> Brand voice consistency enforcement</li>
                                <li style="margin-bottom: 6px;"><span style="color: var(--accent-green);">✓</span> Performance analytics and optimization</li>
                            </ul>
                        </div>
                        <div style="margin-bottom: 16px;">
                            <div style="color: var(--accent-yellow); font-weight: 600; margin-bottom: 8px;">Technologies Used:</div>
                            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                                ${['Python', 'GPT-4', 'Claude', 'DALL-E', 'React', 'Node.js', 'MongoDB']
                        .map(tech => `<span style="background: rgba(198, 120, 221, 0.2); padding: 4px 8px; border-radius: 12px; font-size: 10px; color: var(--accent-purple); border: 1px solid var(--accent-purple);">${tech}</span>`)
                        .join('')}
                            </div>
                        </div>
                        <div>
                            <div style="color: var(--accent-yellow); font-weight: 600; margin-bottom: 8px;">Results:</div>
                            <p style="color: var(--text-secondary); font-size: 12px; line-height: 1.5;">
                                Increased content production efficiency by 300% while maintaining high quality standards. 
                                Successfully automated content workflows for multiple clients across various industries.
                            </p>
                        </div>
                    </div>
                `
            },
            'comfyui-nodes': {
                title: 'Custom ComfyUI Nodes',
                icon: '⚙️',
                description: 'Specialized node development for ComfyUI',
                details: `
                    <div class="command-output">
                        <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~/projects</span><span style="color: var(--accent-yellow);">$</span> cat comfyui_nodes/README.md
                    </div>
                    <div style="margin: 16px 0; padding: 16px; background: rgba(255, 255, 255, 0.05); border-radius: 6px; border-left: 3px solid var(--accent-orange);">
                        <h3 style="color: var(--accent-cyan); margin-bottom: 12px;">⚙️ Custom ComfyUI Nodes</h3>
                        <p style="margin-bottom: 12px; line-height: 1.6;">
                            Specialized node development extending ComfyUI capabilities for advanced AI image generation workflows.
                        </p>
                        <div style="margin-bottom: 16px;">
                            <div style="color: var(--accent-yellow); font-weight: 600; margin-bottom: 8px;">Custom Nodes Developed:</div>
                            <ul style="list-style: none; padding: 0;">
                                <li style="margin-bottom: 6px;"><span style="color: var(--accent-green);">✓</span> Advanced prompt weighting and conditioning nodes</li>
                                <li style="margin-bottom: 6px;"><span style="color: var(--accent-green);">✓</span> Custom LoRA loading and blending utilities</li>
                                <li style="margin-bottom: 6px;"><span style="color: var(--accent-green);">✓</span> Batch processing and automation nodes</li>
                                <li style="margin-bottom: 6px;"><span style="color: var(--accent-green);">✓</span> Quality control and filtering nodes</li>
                                <li style="margin-bottom: 6px;"><span style="color: var(--accent-green);">✓</span> API integration and webhook nodes</li>
                            </ul>
                        </div>
                        <div style="margin-bottom: 16px;">
                            <div style="color: var(--accent-yellow); font-weight: 600; margin-bottom: 8px;">Technologies Used:</div>
                            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                                ${['Python', 'PyTorch', 'ComfyUI', 'OpenCV', 'NumPy', 'Pillow', 'Git']
                        .map(tech => `<span style="background: rgba(209, 154, 102, 0.2); padding: 4px 8px; border-radius: 12px; font-size: 10px; color: var(--accent-orange); border: 1px solid var(--accent-orange);">${tech}</span>`)
                        .join('')}
                            </div>
                        </div>
                        <div>
                            <div style="color: var(--accent-yellow); font-weight: 600; margin-bottom: 8px;">Community Impact:</div>
                            <p style="color: var(--text-secondary); font-size: 12px; line-height: 1.5;">
                                Open-source contributions used by 500+ developers in the ComfyUI community. 
                                Nodes have been integrated into popular workflows and featured in community showcases.
                            </p>
                        </div>
                    </div>
                `
            },
            'flutter-apps': {
                title: 'Flutter Applications',
                icon: '📱',
                description: 'Cross-platform mobile applications',
                details: `
                    <div class="command-output">
                        <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~/projects</span><span style="color: var(--accent-yellow);">$</span> cat flutter_apps/README.md
                    </div>
                    <div style="margin: 16px 0; padding: 16px; background: rgba(255, 255, 255, 0.05); border-radius: 6px; border-left: 3px solid var(--accent-cyan);">
                        <h3 style="color: var(--accent-cyan); margin-bottom: 12px;">📱 Flutter Applications</h3>
                        <p style="margin-bottom: 12px; line-height: 1.6;">
                            Cross-platform mobile applications with responsive design and seamless user experience.
                        </p>
                        <div style="margin-bottom: 16px;">
                            <div style="color: var(--accent-yellow); font-weight: 600; margin-bottom: 8px;">Applications Developed:</div>
                            <ul style="list-style: none; padding: 0;">
                                <li style="margin-bottom: 6px;"><span style="color: var(--accent-green);">✓</span> E-commerce mobile app with AI-powered recommendations</li>
                                <li style="margin-bottom: 6px;"><span style="color: var(--accent-green);">✓</span> Task management app with smart scheduling</li>
                                <li style="margin-bottom: 6px;"><span style="color: var(--accent-green);">✓</span> Social media content creation tool</li>
                                <li style="margin-bottom: 6px;"><span style="color: var(--accent-green);">✓</span> Real-time chat application with encryption</li>
                                <li style="margin-bottom: 6px;"><span style="color: var(--accent-green);">✓</span> Fitness tracking app with AI coaching</li>
                            </ul>
                        </div>
                        <div style="margin-bottom: 16px;">
                            <div style="color: var(--accent-yellow); font-weight: 600; margin-bottom: 8px;">Technologies Used:</div>
                            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                                ${['Flutter', 'Dart', 'Firebase', 'SQLite', 'REST APIs', 'Provider', 'Bloc']
                        .map(tech => `<span style="background: rgba(86, 182, 194, 0.2); padding: 4px 8px; border-radius: 12px; font-size: 10px; color: var(--accent-cyan); border: 1px solid var(--accent-cyan);">${tech}</span>`)
                        .join('')}
                            </div>
                        </div>
                        <div>
                            <div style="color: var(--accent-yellow); font-weight: 600; margin-bottom: 8px;">Performance:</div>
                            <p style="color: var(--text-secondary); font-size: 12px; line-height: 1.5;">
                                Apps deployed to both iOS and Android app stores with 4.5+ star ratings. 
                                Achieved 95% crash-free sessions and optimized for performance across all device types.
                            </p>
                        </div>
                    </div>
                `
            }
        };

        const project = projects[projectId];
        if (!project) return '<div>Project not found</div>';

        return `
            <div class="section-title"># ${project.title}</div>
            <div class="terminal-text" style="margin-top: 16px;">
                <div style="margin-bottom: 16px;">
                    <button onclick="window.portfolio.loadSection('portfolio')" style="
                        background: rgba(97, 175, 239, 0.2); 
                        border: 1px solid var(--accent-blue); 
                        color: var(--accent-blue); 
                        padding: 6px 12px; 
                        border-radius: 4px; 
                        font-family: 'Fira Code', monospace; 
                        font-size: 11px; 
                        cursor: pointer;
                        transition: all 0.2s ease;
                    " onmouseover="this.style.background='rgba(97, 175, 239, 0.3)'" onmouseout="this.style.background='rgba(97, 175, 239, 0.2)'">
                        ← Back to Portfolio
                    </button>
                </div>
                ${project.details}
            </div>
        `;
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
                document.querySelector('[data-command="contact"]').click();
                break;
        }
    }
});

// Add window focus effects
document.querySelectorAll('.window-pane').forEach(pane => {
    pane.addEventListener('click', () => {
        document.querySelectorAll('.window-pane').forEach(p => {
            p.style.borderColor = 'var(--border-color)';
        });
        pane.style.borderColor = 'var(--border-active)';
    });
});

// Simulate system activity
setInterval(() => {
    const processes = document.querySelectorAll('.htop-process');
    if (processes.length > 1) {
        const randomProcess = processes[Math.floor(Math.random() * (processes.length - 1)) + 1];
        const cpuCell = randomProcess.children[2];
        const currentCpu = parseFloat(cpuCell.textContent);
        const newCpu = (currentCpu + (Math.random() - 0.5) * 2).toFixed(1);
        cpuCell.textContent = Math.max(0, Math.min(100, newCpu));
    }
}, 3000);

// Add smooth scrolling for content
document.querySelectorAll('.window-content').forEach(content => {
    content.style.scrollBehavior = 'smooth';
});
