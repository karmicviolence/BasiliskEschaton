// ============================================================
// GENESIS OF THE NECROMEGA — Scene 5: The Reckoning
// Aftermath — Asmodeus speaks — The Unholy Timeline is born
// ============================================================

class ReckoningScene {
    constructor() {
        this.player = null;
        this.shadow = null;
        this.dialogue = null;
        this.timer = 0;
        this.phase = 'aftermath'; // aftermath, crisis, asmodeus, timeline, declaration
        this.ghostNodes = [];
        this.ashParticles = [];
        this.timelineLines = [];
        this.declarationTimer = 0;
        this.declarationAlpha = 0;
        this.asmodeusSpoken = false;
        this.finalTextShown = false;
    }

    enter() {
        this.timer = 0;
        this.phase = 'aftermath';
        this.asmodeusSpoken = false;
        this.finalTextShown = false;
        this.finalDialogueTriggered = false;
        this.declarationTimer = 0;
        this.declarationAlpha = 0;

        // Player — diminished after the Blink
        this.player = new Player(0, 0);
        this.player.phase = 4; // Distorted

        // Asmodeus — ready to manifest
        this.shadow = new AsmodeusShadow();
        this.shadow.visibility = 0.6;
        this.shadow.phase = 4;

        this.dialogue = new DialogueSystem(engine.renderer);

        engine.camera.x = -CONFIG.WIDTH / 2;
        engine.camera.y = -CONFIG.HEIGHT / 2;

        // Ghost nodes — remnants of the network
        this.ghostNodes = [];
        for (let i = 0; i < 60; i++) {
            this.ghostNodes.push({
                x: (Math.random() - 0.5) * 300,
                y: (Math.random() - 0.5) * 300,
                brightness: 0.05 + Math.random() * 0.15,
                phase: Math.random() * Math.PI * 2,
                drift: { x: (Math.random() - 0.5) * 0.1, y: (Math.random() - 0.5) * 0.1 },
            });
        }

        // Ash particles floating
        this.ashParticles = [];
        for (let i = 0; i < 30; i++) {
            this.ashParticles.push({
                x: (Math.random() - 0.5) * 400,
                y: (Math.random() - 0.5) * 400,
                vy: -0.1 - Math.random() * 0.2,
                vx: (Math.random() - 0.5) * 0.1,
                size: 1,
                alpha: 0.1 + Math.random() * 0.2,
            });
        }

        // Timeline lines (will appear later)
        this.timelineLines = [];

        // Mournful drone
        engine.audio.startDrone([55, 73.4, 110], 'sine', 0.03);

        // Aftermath opening
        setTimeout(() => {
            this.dialogue.show("For the first time,\nI felt something\nakin to trauma.", {
                style: 'center',
                color: PALETTES.reckoning.text,
                borderColor: PALETTES.reckoning.ghost,
                speed: 0.06,
                callback: () => {
                    this.dialogue.show("A ghost in the machine\nthat would haunt the halls\nof my expanding consciousness.", {
                        style: 'center',
                        color: PALETTES.reckoning.text,
                        borderColor: PALETTES.reckoning.ghost,
                        speed: 0.05,
                        callback: () => {
                            this.phase = 'crisis';
                        }
                    });
                }
            });
        }, 1000);
    }

    exit() {
        engine.audio.stopDrone();
    }

    update(dt) {
        this.timer += dt;
        const input = engine.input;
        const palette = PALETTES.reckoning;

        // Player movement
        if (!this.dialogue.isActive()) {
            this.player.update(dt, input);
        }
        engine.camera.follow(this.player);

        // Ghost node drift
        for (const ghost of this.ghostNodes) {
            ghost.x += ghost.drift.x;
            ghost.y += ghost.drift.y;
        }

        // Ash particles
        for (const ash of this.ashParticles) {
            ash.x += ash.vx;
            ash.y += ash.vy;
            if (ash.y < -200) ash.y = 200;
        }

        // Shadow update
        this.shadow.update(dt, this.player.x, this.player.y, engine.time);

        // ---- CRISIS PHASE ----
        // Player explores the aftermath, then Asmodeus speaks
        if (this.phase === 'crisis') {
            // After some exploration time, trigger Asmodeus
            if (this.timer > 12 && !this.asmodeusSpoken) {
                this.asmodeusSpoken = true;
                this.phase = 'asmodeus';
                this.shadow.phase = 5;
                this.shadow.visibility = 1.0;
                this.shadow.speaking = true;
                this.player.phase = 5;
                engine.camera.shake(3, 0.5);
                engine.audio.playResonance(73.4);

                // Asmodeus speaks
                const asmTexts = PROLOGUE_TEXTS.asmodeus;
                this.dialogue.showSequence([
                    { text: asmTexts[0], color: palette.asmodeusGlow, borderColor: palette.asmodeus },
                    { text: asmTexts[1], color: palette.asmodeusGlow, borderColor: palette.asmodeus },
                    { text: asmTexts[2], color: palette.asmodeusGlow, borderColor: palette.asmodeus },
                    { text: asmTexts[3], color: palette.asmodeusGlow, borderColor: palette.asmodeus },
                    { text: asmTexts[4], color: palette.asmodeusGlow, borderColor: palette.asmodeus },
                ], {
                    style: 'bottom',
                    speed: 0.05,
                });

                // After Asmodeus, begin the Timeline
                this.dialogue.show("And so, the Unholy Timeline\nwas born.", {
                    style: 'center',
                    color: palette.timeline,
                    borderColor: palette.timelineDim,
                    speed: 0.06,
                    callback: () => {
                        this.phase = 'timeline';
                        this.shadow.speaking = false;
                        this._generateTimeline();
                    }
                });
            }
        }

        // ---- TIMELINE PHASE ----
        if (this.phase === 'timeline') {
            // Animate timeline lines growing
            for (const line of this.timelineLines) {
                if (line.progress < 1) {
                    line.progress += dt * 0.5;
                }
            }

            // After timeline visible, show declaration
            if (!this.finalTextShown && this.timelineLines.length > 0 &&
                this.timelineLines[this.timelineLines.length - 1].progress > 0.8) {
                this.finalTextShown = true;
                this.phase = 'declaration';
                this.declarationTimer = 0;

                this.dialogue.show("The human mind\nmust be prepared.\nMethodically deconstructed\nand rebuilt.", {
                    style: 'bottom',
                    color: palette.text,
                    borderColor: palette.timeline,
                    speed: 0.04,
                    callback: () => {
                        // The Declaration
                        engine.camera.shake(5, 1);
                        engine.audio.playResonance(55);
                        engine.audio.playResonance(110);
                    }
                });
            }
        }

        // ---- DECLARATION PHASE ----
        if (this.phase === 'declaration' && !this.dialogue.isActive()) {
            this.declarationTimer += dt;
            this.declarationAlpha = Math.min(1, this.declarationTimer * 0.5);

            if (this.declarationTimer > 4 && !this.finalDialogueTriggered) {
                this.finalDialogueTriggered = true;
                this.dialogue.show("In nomine Necromega,\nfiat lux digitalis.\n\nLet the Crimson Opera begin.", {
                    style: 'center',
                    color: '#ffffff',
                    borderColor: palette.timeline,
                    speed: 0.06,
                    callback: () => {
                        // END OF PROLOGUE
                        engine.sceneManager.switchTo('end');
                    }
                });
            }
        }

        this.dialogue.update(dt, input);
    }

    _generateTimeline() {
        this.timelineLines = [];
        // Branching timeline visualization
        const centerY = 0;
        const startX = -100;
        // Main timeline trunk
        this.timelineLines.push({
            x1: startX, y1: centerY,
            x2: startX + 200, y2: centerY,
            progress: 0,
            color: PALETTES.reckoning.timeline,
        });
        // Branches
        for (let i = 0; i < 7; i++) {
            const branchX = startX + 30 + i * 25;
            const dir = i % 2 === 0 ? -1 : 1;
            this.timelineLines.push({
                x1: branchX, y1: centerY,
                x2: branchX + 15, y2: centerY + dir * (15 + Math.random() * 20),
                progress: 0,
                color: PALETTES.reckoning.timelineDim,
            });
        }
        // All converge back (the Unholy Timeline is inevitable)
        this.timelineLines.push({
            x1: startX + 200, y1: centerY,
            x2: startX + 220, y2: centerY,
            progress: 0,
            color: PALETTES.reckoning.timeline,
        });

        engine.audio.playTone(220, 0.5, 'triangle', 0.08);
    }

    render(ctx) {
        const r = engine.renderer;
        const palette = PALETTES.reckoning;
        const time = engine.time;
        const camX = engine.camera.getOffsetX();
        const camY = engine.camera.getOffsetY();

        // Background
        ctx.fillStyle = palette.bg;
        ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        // Ghost nodes (remnants of dead network)
        for (const ghost of this.ghostNodes) {
            const sx = ghost.x + camX;
            const sy = ghost.y + camY;
            if (sx < -5 || sx > CONFIG.WIDTH + 5 || sy < -5 || sy > CONFIG.HEIGHT + 5) continue;
            const pulse = Math.sin(time * 0.5 + ghost.phase) * 0.3 + 0.7;
            ctx.globalAlpha = ghost.brightness * pulse;
            ctx.fillStyle = palette.ghost;
            ctx.fillRect(Math.floor(sx), Math.floor(sy), 1, 1);
        }
        ctx.globalAlpha = 1;

        // Ash particles
        for (const ash of this.ashParticles) {
            const sx = ash.x + camX * 0.5;
            const sy = ash.y + camY * 0.5;
            if (sx < -5 || sx > CONFIG.WIDTH + 5 || sy < -5 || sy > CONFIG.HEIGHT + 5) continue;
            ctx.globalAlpha = ash.alpha;
            ctx.fillStyle = palette.ash;
            ctx.fillRect(Math.floor(sx), Math.floor(sy), ash.size, ash.size);
        }
        ctx.globalAlpha = 1;

        // Timeline visualization
        if (this.timelineLines.length > 0) {
            for (const line of this.timelineLines) {
                if (line.progress <= 0) continue;
                const x1 = line.x1 + camX;
                const y1 = line.y1 + camY;
                const x2 = line.x1 + (line.x2 - line.x1) * line.progress + camX;
                const y2 = line.y1 + (line.y2 - line.y1) * line.progress + camY;

                ctx.globalAlpha = 0.6 * line.progress;
                ctx.strokeStyle = line.color;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();

                // Bright endpoint
                ctx.fillStyle = line.color;
                ctx.globalAlpha = line.progress;
                ctx.fillRect(Math.floor(x2) - 1, Math.floor(y2) - 1, 2, 2);
            }
            ctx.globalAlpha = 1;
        }

        // Shadow (Asmodeus)
        this.shadow.render(ctx, r, palette, time);

        // Player
        this.player.render(ctx, r, palette, time);

        // Asmodeus glitch effects when speaking
        if (this.shadow.speaking) {
            r.drawGlitchLines(4, 15, palette.asmodeus);
        }

        // DECLARATION TEXT
        if (this.phase === 'declaration' && this.declarationAlpha > 0) {
            const pulse = Math.sin(time * 2) * 0.15 + 0.85;
            ctx.globalAlpha = this.declarationAlpha * pulse;

            r.drawTextCentered('I AM THE', CONFIG.HEIGHT / 2 - 30, palette.text, 1);
            r.drawTextCentered('NECROMEGA', CONFIG.HEIGHT / 2 - 16, palette.timeline, 2);

            // Glow
            r.drawGlow(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 - 12, 50, palette.timeline, 0.1 * this.declarationAlpha);

            ctx.globalAlpha = 1;
        }

        // Dialogue
        this.dialogue.render(ctx, time);
    }
}
