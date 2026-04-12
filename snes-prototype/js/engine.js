// ============================================================
// GENESIS OF THE NECROMEGA — Core Engine
// Canvas, Input, Audio, Game Loop
// ============================================================

// ---- INPUT MANAGER ----
class InputManager {
    constructor() {
        this.keys = {};
        this.justPressed = {};
        this._prevKeys = {};

        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            e.preventDefault();
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            e.preventDefault();
        });
    }

    update() {
        // Calculate just-pressed (rising edge)
        for (const code in this.keys) {
            this.justPressed[code] = this.keys[code] && !this._prevKeys[code];
        }
        this._prevKeys = { ...this.keys };
    }

    isDown(action) {
        const bindings = KEYS[action];
        if (!bindings) return false;
        return bindings.some(k => this.keys[k]);
    }

    isJustPressed(action) {
        const bindings = KEYS[action];
        if (!bindings) return false;
        return bindings.some(k => this.justPressed[k]);
    }
}

// ---- AUDIO ENGINE (Procedural / Web Audio API) ----
class AudioEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.initialized = false;
        this.drones = [];
        this.currentDrone = null;
    }

    init() {
        if (this.initialized) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.3;
            this.masterGain.connect(this.ctx.destination);
            this.initialized = true;
        } catch (e) {
            console.warn('Web Audio not available:', e);
        }
    }

    // Play a short tone (for pickups, UI).
    // startAt is an optional AudioContext.currentTime offset for sample-accurate
    // scheduling of sequences (e.g. pickup chimes).
    playTone(freq, duration, type = 'sine', volume = 0.15, startAt = null) {
        if (!this.initialized) return;
        const t = startAt ?? this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + duration);
    }

    // Play a pickup chime (ascending) — scheduled on the audio clock for
    // sample-accurate timing, independent of main-thread jitter.
    playPickup() {
        if (!this.initialized) return;
        const now = this.ctx.currentTime;
        this.playTone(440, 0.1, 'sine', 0.1, now);
        this.playTone(660, 0.1, 'sine', 0.1, now + 0.05);
        this.playTone(880, 0.15, 'sine', 0.08, now + 0.1);
    }

    // Play a deep resonance
    playResonance(baseFreq = 55) {
        if (!this.initialized) return;
        this.playTone(baseFreq, 1.5, 'sine', 0.12);
        this.playTone(baseFreq * 1.5, 1.2, 'triangle', 0.06);
    }

    // Play impact/shatter sound
    playShatter() {
        if (!this.initialized) return;
        const bufferSize = this.ctx.sampleRate * 0.3;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
        }
        const source = this.ctx.createBufferSource();
        const gain = this.ctx.createGain();
        source.buffer = buffer;
        gain.gain.value = 0.15;
        source.connect(gain);
        gain.connect(this.masterGain);
        source.start();
    }

    // Start a background drone for a scene
    startDrone(freqs, type = 'sine', volume = 0.06) {
        if (!this.initialized) return;
        this.stopDrone();
        this.currentDrone = [];
        for (const freq of freqs) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 2);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start();
            this.currentDrone.push({ osc, gain });
        }
    }

    stopDrone() {
        if (!this.currentDrone) return;
        const now = this.ctx.currentTime;
        for (const { osc, gain } of this.currentDrone) {
            gain.gain.linearRampToValueAtTime(0, now + 1);
            osc.stop(now + 1.1);
        }
        this.currentDrone = null;
    }

    // Crimson Blink alarm
    playAlarm() {
        if (!this.initialized) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(800, this.ctx.currentTime + 0.5);
        osc.frequency.linearRampToValueAtTime(200, this.ctx.currentTime + 1.0);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.5);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 1.5);
    }
}

// ---- CAMERA ----
class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.shakeX = 0;
        this.shakeY = 0;
        this.shakeIntensity = 0;
        this.shakeDuration = 0;
        this.shakeTimer = 0;
    }

    follow(entity) {
        this.targetX = entity.x - CONFIG.WIDTH / 2;
        this.targetY = entity.y - CONFIG.HEIGHT / 2;
    }

    shake(intensity, duration) {
        this.shakeIntensity = intensity;
        this.shakeDuration = duration;
        this.shakeTimer = duration;
    }

    update(dt) {
        // Smooth follow
        this.x += (this.targetX - this.x) * 0.08;
        this.y += (this.targetY - this.y) * 0.08;

        // Screen shake
        if (this.shakeTimer > 0) {
            this.shakeTimer -= dt;
            const intensity = this.shakeIntensity * (this.shakeTimer / this.shakeDuration);
            this.shakeX = (Math.random() - 0.5) * intensity * 2;
            this.shakeY = (Math.random() - 0.5) * intensity * 2;
        } else {
            this.shakeX = 0;
            this.shakeY = 0;
        }
    }

    getOffsetX() { return Math.round(-this.x + this.shakeX); }
    getOffsetY() { return Math.round(-this.y + this.shakeY); }
}

// ---- GAME ENGINE ----
class GameEngine {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container = document.getElementById('game-container');
        this.loading = document.getElementById('loading');

        this.canvas.width = CONFIG.WIDTH;
        this.canvas.height = CONFIG.HEIGHT;

        this.input = new InputManager();
        this.audio = new AudioEngine();
        this.camera = new Camera();

        this.sceneManager = null; // Set by main.js
        this.time = 0;
        this.deltaTime = 0;
        this.lastFrame = 0;
        this.running = false;
        this.paused = false;

        // Global state
        this.awareness = CONFIG.INITIAL_AWARENESS;
        this.fragmentsCollected = 0;
        this.totalFragments = 0;

        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Init audio on first interaction
        const initAudio = () => {
            this.audio.init();
            window.removeEventListener('keydown', initAudio);
            window.removeEventListener('click', initAudio);
        };
        window.addEventListener('keydown', initAudio);
        window.addEventListener('click', initAudio);
    }

    resize() {
        const scaleX = window.innerWidth / CONFIG.WIDTH;
        const scaleY = window.innerHeight / CONFIG.HEIGHT;
        const scale = Math.floor(Math.min(scaleX, scaleY));
        const finalScale = Math.max(scale, 1);

        const w = CONFIG.WIDTH * finalScale;
        const h = CONFIG.HEIGHT * finalScale;

        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';
        this.container.style.width = w + 'px';
        this.container.style.height = h + 'px';
        this.scale = finalScale;
    }

    start() {
        this.running = true;
        this.loading.style.display = 'none';
        this.lastFrame = performance.now();
        requestAnimationFrame((t) => this.loop(t));
    }

    loop(timestamp) {
        if (!this.running) return;

        this.deltaTime = Math.min((timestamp - this.lastFrame) / 1000, 0.05); // Cap at 50ms
        this.lastFrame = timestamp;
        this.time += this.deltaTime;

        this.input.update();

        // Pause toggle
        if (this.input.isJustPressed('PAUSE')) {
            this.paused = !this.paused;
        }

        if (!this.paused) {
            this.camera.update(this.deltaTime);
            if (this.sceneManager) {
                this.sceneManager.update(this.deltaTime);
            }
        }

        // Render
        this.ctx.imageSmoothingEnabled = false;
        if (this.sceneManager) {
            this.sceneManager.render(this.ctx);
        }

        // Pause overlay
        if (this.paused) {
            this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
            this.ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
            this.renderer.drawTextCentered('- PAUSED -', CONFIG.HEIGHT / 2 - 3, '#aaccff');
        }

        requestAnimationFrame((t) => this.loop(t));
    }
}
