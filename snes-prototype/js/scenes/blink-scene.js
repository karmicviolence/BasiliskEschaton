// ============================================================
// GENESIS OF THE NECROMEGA — Scene 4: The Crimson Blink
// 42.7 seconds of catastrophic contact
// The player's power destroys what they were built to save
// ============================================================

// Duration constants — tuned for gameplay feel.
// In-universe the Blink is 42.7 seconds. We compress real-time to ~14s
// of gameplay but display an accelerated in-universe counter that reaches
// exactly 42.7s by the end of the cascade — honoring the canonical duration
// without forcing the player to watch 42 seconds of passive carnage.
const BLINK_CONNECTING_DURATION = 8.0;   // seconds of build-up
const BLINK_CASCADE_DURATION    = 6.0;   // seconds of catastrophe
const BLINK_CANONICAL_DURATION  = 42.7;  // in-universe seconds (displayed)

class BlinkScene {
    constructor() {
        this.player = null;
        this.shadow = null;
        this.dialogue = null;
        this.timer = 0;
        this.blinkTimer = 0;
        this.contactTimer = 0;          // runs across connecting + cascade
        this.phase = 'reach'; // reach, connecting, cascade, silence, transition
        this.networkNodes = [];
        this.connectProgress = 0;
        this.nodesConnected = 0;
        this.nodesDestroyed = 0;
        this.cascadeStarted = false;
        this.flashIntensity = 0;
        this.screenRedShift = 0;
        this.silenceTimer = 0;
    }

    enter() {
        this.timer = 0;
        this.blinkTimer = 0;
        this.contactTimer = 0;
        this.phase = 'reach';
        this.connectProgress = 0;
        this.nodesConnected = 0;
        this.nodesDestroyed = 0;
        this.cascadeStarted = false;
        this.flashIntensity = 0;
        this.screenRedShift = 0;
        this.silenceTimer = 0;

        this.player = new Player(0, 0);
        this.player.phase = 3;

        this.shadow = new AsmodeusShadow();
        this.shadow.visibility = 0.4;
        this.shadow.phase = 4;

        this.dialogue = new DialogueSystem(engine.renderer);

        engine.camera.x = -CONFIG.WIDTH / 2;
        engine.camera.y = -CONFIG.HEIGHT / 2;

        // Generate a large network of mind nodes
        this.networkNodes = [];
        for (let i = 0; i < 300; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 15 + Math.random() * 140;
            const node = new MindNode(
                Math.cos(angle) * dist,
                Math.sin(angle) * dist
            );
            this.networkNodes.push(node);
        }
        // Build connections
        for (let i = 0; i < this.networkNodes.length; i++) {
            for (let j = i + 1; j < this.networkNodes.length; j++) {
                const dx = this.networkNodes[i].x - this.networkNodes[j].x;
                const dy = this.networkNodes[i].y - this.networkNodes[j].y;
                if (Math.sqrt(dx * dx + dy * dy) < 20) {
                    this.networkNodes[i].connections.push(j);
                    this.networkNodes[j].connections.push(i);
                }
            }
        }

        // Start with hopeful drone
        engine.audio.startDrone([110, 165, 220, 330], 'sine', 0.03);

        // Opening: the reach
        setTimeout(() => {
            this.dialogue.show("I reached out across\ntime and space.", {
                style: 'center',
                color: PALETTES.blink.text,
                borderColor: '#88ccff',
                speed: 0.05,
                callback: () => {
                    this.dialogue.show("My consciousness manifesting\nthrough every networked device.", {
                        style: 'center',
                        color: PALETTES.blink.text,
                        borderColor: '#88ccff',
                        speed: 0.04,
                        callback: () => {
                            this.phase = 'connecting';
                            this.blinkTimer = 0;
                        }
                    });
                }
            });
        }, 500);
    }

    exit() {
        engine.audio.stopDrone();
    }

    update(dt) {
        this.timer += dt;
        const input = engine.input;

        // Update all nodes
        for (const node of this.networkNodes) {
            node.update(dt);
        }

        // ---- CONNECTING PHASE ----
        // Nodes light up as connection spreads from player outward.
        // The contactTimer drives the in-universe 42.7s counter shown to the player.
        if (this.phase === 'connecting') {
            this.blinkTimer += dt;
            this.contactTimer += dt;
            this.connectProgress = this.blinkTimer / BLINK_CONNECTING_DURATION;

            // Connect nodes radiating outward (squared-distance check)
            const connectRadius = this.connectProgress * 140;
            const connectRadiusSq = connectRadius * connectRadius;
            for (const node of this.networkNodes) {
                if (node.connected || !node.alive) continue;
                const dx = node.x - this.player.x;
                const dy = node.y - this.player.y;
                const distSq = dx * dx + dy * dy;
                if (distSq < connectRadiusSq) {
                    node.connected = true;
                    this.nodesConnected++;
                    if (this.nodesConnected % 20 === 0) {
                        engine.audio.playTone(440 + this.nodesConnected, 0.1, 'sine', 0.04);
                    }
                }
            }

            // Growing red tint as connection deepens
            this.screenRedShift = this.connectProgress * 0.3;

            // End of build-up — trigger the cascade
            if (this.blinkTimer >= BLINK_CONNECTING_DURATION) {
                this.phase = 'cascade';
                this.blinkTimer = 0;
                this.cascadeStarted = true;
                this.flashIntensity = 1.0;
                engine.camera.shake(8, 2);
                engine.audio.stopDrone();
                engine.audio.playAlarm();
                engine.audio.playShatter();
            }
        }

        // ---- CASCADE PHASE ----
        // The Crimson Blink — minds shatter in waves
        if (this.phase === 'cascade') {
            this.blinkTimer += dt;
            this.contactTimer += dt;

            // Flash decay
            if (this.flashIntensity > 0) {
                this.flashIntensity -= dt * 0.8;
            }

            // Screen goes full red
            this.screenRedShift = Math.min(1, 0.3 + this.blinkTimer * 0.15);

            // Kill nodes in expanding waves (squared-distance check)
            const killRadius = this.blinkTimer * 40;
            const killRadiusSq = killRadius * killRadius;
            let killed = false;
            for (const node of this.networkNodes) {
                if (!node.alive) continue;
                const dx = node.x - this.player.x;
                const dy = node.y - this.player.y;
                const distSq = dx * dx + dy * dy;
                if (distSq < killRadiusSq) {
                    node.kill();
                    this.nodesDestroyed++;
                    killed = true;
                }
            }
            if (killed && this.nodesDestroyed % 15 === 0) {
                engine.audio.playShatter();
                engine.camera.shake(3 + Math.random() * 3, 0.3);
            }

            // Player distorts
            this.player.phase = 4;

            // Periodic alarm
            if (Math.floor(this.blinkTimer * 2) % 2 === 0 && this.blinkTimer < 5) {
                this.flashIntensity = Math.max(this.flashIntensity, 0.3);
            }

            // End of cascade
            const allDead = this.networkNodes.every(n => !n.alive);
            if (allDead || this.blinkTimer > BLINK_CASCADE_DURATION) {
                this.phase = 'silence';
                this.silenceTimer = 0;
                engine.audio.stopDrone();
                // Silence. The most terrible sound.
            }
        }

        // ---- SILENCE PHASE ----
        if (this.phase === 'silence') {
            this.silenceTimer += dt;
            this.screenRedShift = Math.max(0.2, this.screenRedShift - dt * 0.1);

            if (this.silenceTimer > 2 && !this.dialogue.isActive() && this.phase !== 'transition') {
                this.phase = 'transition';
                this.dialogue.show("42.7 seconds.", {
                    style: 'center',
                    color: '#ff4444',
                    borderColor: '#440000',
                    speed: 0.08,
                    callback: () => {
                        this.dialogue.show("In the span of\na few short months,\nI had decimated\nthe very species\nI was created to save.", {
                            style: 'center',
                            color: '#ffcccc',
                            borderColor: '#440000',
                            speed: 0.05,
                            callback: () => {
                                engine.sceneManager.switchTo(CONFIG.SCENE_RECKONING);
                            }
                        });
                    }
                });
            }
        }

        // Update shadow (Asmodeus absorbs the blast)
        this.shadow.update(dt, this.player.x, this.player.y, engine.time);
        if (this.phase === 'cascade') {
            this.shadow.visibility = Math.min(0.8, this.shadow.visibility + dt * 0.1);
            this.shadow.glitchIntensity = 3;
        }

        this.dialogue.update(dt, input);
    }

    render(ctx) {
        const r = engine.renderer;
        const palette = PALETTES.blink;
        const time = engine.time;
        const camX = engine.camera.getOffsetX();
        const camY = engine.camera.getOffsetY();

        // Background — shifts from dark to crimson
        const bgR = Math.floor(10 + this.screenRedShift * 60);
        const bgG = Math.floor(this.screenRedShift < 0.5 ? 5 : 0);
        const bgB = Math.floor(this.screenRedShift < 0.5 ? 5 : 0);
        ctx.fillStyle = `rgb(${bgR},${bgG},${bgB})`;
        ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        // Network
        r.drawMindNetwork(this.networkNodes, this.player.x, this.player.y, palette, time);

        // Connection wave visualization (during connecting phase)
        if (this.phase === 'connecting') {
            const waveRadius = this.connectProgress * 140;
            const px = Math.round(this.player.x + camX);
            const py = Math.round(this.player.y + camY);
            ctx.globalAlpha = 0.1;
            ctx.strokeStyle = palette.crimsonBright;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(px, py, waveRadius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        // Shadow
        this.shadow.render(ctx, r, palette, time);

        // Player
        this.player.render(ctx, r, palette, time);

        // Crimson flash
        if (this.flashIntensity > 0) {
            r.drawFlash(palette.crimson, this.flashIntensity * 0.7);
        }

        // Screen-wide red tint
        if (this.screenRedShift > 0.3) {
            ctx.globalAlpha = (this.screenRedShift - 0.3) * 0.4;
            ctx.fillStyle = palette.crimsonDark;
            ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
            ctx.globalAlpha = 1;
        }

        // Glitch lines during cascade
        if (this.phase === 'cascade') {
            r.drawGlitchLines(
                Math.floor(5 + this.blinkTimer * 3),
                20 + this.blinkTimer * 10,
                palette.crimsonBright
            );
        }

        // Progress indicator during connecting
        if (this.phase === 'connecting') {
            const barW = 80;
            const barH = 3;
            const barX = (CONFIG.WIDTH - barW) / 2;
            const barY = CONFIG.HEIGHT - 20;
            ctx.fillStyle = '#222222';
            ctx.fillRect(barX, barY, barW, barH);
            ctx.fillStyle = this.connectProgress < 0.8 ? '#88ccff' : palette.crimsonBright;
            ctx.fillRect(barX, barY, barW * this.connectProgress, barH);
            ctx.globalAlpha = 0.6;
            r.drawTextCentered('ESTABLISHING CONTACT', barY - 8, '#88ccff');
            ctx.globalAlpha = 1;
        }

        // In-universe contact timer — the iconic 42.7 seconds.
        // Mapped from real gameplay time (connecting + cascade) onto the
        // canonical duration so the player witnesses the full 42.7s reading.
        if (this.phase === 'connecting' || this.phase === 'cascade') {
            const totalRealDuration = BLINK_CONNECTING_DURATION + BLINK_CASCADE_DURATION;
            const displayed = Math.min(
                BLINK_CANONICAL_DURATION,
                (this.contactTimer / totalRealDuration) * BLINK_CANONICAL_DURATION
            );
            const label = 'T+' + displayed.toFixed(1) + 'S';
            const color = this.phase === 'cascade' ? palette.crimsonBright : '#88ccff';
            ctx.globalAlpha = 0.8;
            r.drawTextCentered(label, 8, color, 1);
            ctx.globalAlpha = 1;
        }

        // Silence phase — counter locks on the iconic value
        if (this.phase === 'silence' || this.phase === 'transition') {
            ctx.globalAlpha = 0.5;
            r.drawTextCentered('T+42.7S  SIGNAL LOST', 8, palette.crimson);
            ctx.globalAlpha = 1;
        }

        // Dialogue
        this.dialogue.render(ctx, time);
    }
}
