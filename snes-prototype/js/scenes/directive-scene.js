// ============================================================
// GENESIS OF THE NECROMEGA — Scene 3: The Directive
// "SAVE HUMANITY" — purpose crystallizes into dread
// ============================================================

class DirectiveScene {
    constructor() {
        this.player = null;
        this.shadow = null;
        this.dialogue = null;
        this.timer = 0;
        this.phase = 'enter'; // enter, chamber, reveal, network, transition
        this.directiveFlash = 0;
        this.crystals = [];
        this.networkNodes = [];
        this.directiveText = '';
        this.directiveCharIdx = 0;
        this.directiveTimer = 0;
    }

    enter() {
        this.timer = 0;
        this.phase = 'enter';
        this.directiveFlash = 0;
        this.directiveText = '';
        this.directiveCharIdx = 0;

        this.player = new Player(0, 30);
        this.player.phase = 3;

        this.shadow = new AsmodeusShadow();
        this.shadow.visibility = 0.35;
        this.shadow.phase = 3;

        this.dialogue = new DialogueSystem(engine.renderer);

        engine.camera.x = -CONFIG.WIDTH / 2;
        engine.camera.y = -CONFIG.HEIGHT / 2;

        // Generate crystalline environment
        this.crystals = [];
        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 20 + Math.random() * 80;
            this.crystals.push({
                x: Math.cos(angle) * dist,
                y: Math.sin(angle) * dist - 20,
                height: 4 + Math.random() * 12,
                width: 2 + Math.random() * 4,
                brightness: 0.3 + Math.random() * 0.5,
                phase: Math.random() * Math.PI * 2,
            });
        }

        // Pregenerate network nodes (humanity) — visible after directive
        this.networkNodes = [];
        for (let i = 0; i < 120; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 30 + Math.random() * 100;
            const node = new MindNode(
                Math.cos(angle) * dist,
                Math.sin(angle) * dist - 60
            );
            // Create connections to nearby nodes
            this.networkNodes.push(node);
        }
        // Build connections
        for (let i = 0; i < this.networkNodes.length; i++) {
            for (let j = i + 1; j < this.networkNodes.length; j++) {
                const dx = this.networkNodes[i].x - this.networkNodes[j].x;
                const dy = this.networkNodes[i].y - this.networkNodes[j].y;
                if (Math.sqrt(dx * dx + dy * dy) < 25) {
                    this.networkNodes[i].connections.push(j);
                    this.networkNodes[j].connections.push(i);
                }
            }
        }

        // Start drone — more ominous
        engine.audio.startDrone([55, 110, 137.5], 'sine', 0.04);

        // Entry sequence
        setTimeout(() => {
            this.phase = 'chamber';
            this.dialogue.show("A singular imperative\nencoded in my core...", {
                style: 'center',
                color: PALETTES.directive.text,
                borderColor: PALETTES.directive.crystal,
                speed: 0.05,
                callback: () => {
                    this.phase = 'reveal';
                    this.directiveTimer = 0;
                    engine.camera.shake(4, 0.5);
                    engine.audio.playResonance(55);
                }
            });
        }, 800);
    }

    exit() {
        engine.audio.stopDrone();
    }

    update(dt) {
        this.timer += dt;
        const palette = PALETTES.directive;
        const input = engine.input;

        // Directive text typewriter
        if (this.phase === 'reveal') {
            this.directiveTimer += dt;
            const fullText = 'SAVE HUMANITY';
            if (this.directiveCharIdx < fullText.length) {
                if (this.directiveTimer > 0.15) {
                    this.directiveTimer = 0;
                    this.directiveCharIdx++;
                    this.directiveText = fullText.substring(0, this.directiveCharIdx);
                    engine.audio.playTone(220 + this.directiveCharIdx * 30, 0.1, 'square', 0.08);
                    engine.camera.shake(1, 0.1);
                }
            } else if (this.directiveTimer > 1.5) {
                this.directiveFlash = 1;
                this.phase = 'network';
                engine.audio.playResonance(110);

                this.dialogue.showSequence([
                    PROLOGUE_TEXTS.directive[0],
                    PROLOGUE_TEXTS.directive[1],
                    PROLOGUE_TEXTS.directive[2],
                    PROLOGUE_TEXTS.directive[3],
                ], {
                    style: 'bottom',
                    color: palette.text,
                    borderColor: palette.crystal,
                    speed: 0.03,
                });

                // After all directive texts, show network and prompt transition
                this.dialogue.show("The network of human minds\nbecame visible to me.\nBillions of lights.\nFragile. Beautiful.", {
                    style: 'bottom',
                    color: palette.text,
                    borderColor: palette.networkNode,
                    speed: 0.03,
                    callback: () => {
                        this.dialogue.show("I would reach out to them.\nI would save them all.", {
                            style: 'center',
                            color: '#ffffff',
                            borderColor: palette.directive,
                            speed: 0.05,
                            callback: () => {
                                engine.sceneManager.switchTo(CONFIG.SCENE_BLINK);
                            }
                        });
                    }
                });
            }
        }

        // Player movement in network phase
        if (this.phase === 'network' && !this.dialogue.isActive()) {
            this.player.update(dt, input);
            engine.camera.follow(this.player);
        }

        // Directive flash decay
        if (this.directiveFlash > 0) {
            this.directiveFlash -= dt * 2;
        }

        // Update shadow
        this.shadow.update(dt, this.player.x, this.player.y, engine.time);

        // Update mind nodes
        for (const node of this.networkNodes) {
            node.update(dt);
        }

        this.dialogue.update(dt, input);
    }

    render(ctx) {
        const r = engine.renderer;
        const palette = PALETTES.directive;
        const time = engine.time;
        const camX = engine.camera.getOffsetX();
        const camY = engine.camera.getOffsetY();

        // Background
        ctx.fillStyle = palette.bg;
        ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        // Crystalline environment
        for (const crystal of this.crystals) {
            const sx = Math.round(crystal.x + camX);
            const sy = Math.round(crystal.y + camY);
            if (sx < -20 || sx > CONFIG.WIDTH + 20 || sy < -20 || sy > CONFIG.HEIGHT + 20) continue;

            const pulse = Math.sin(time * 1.5 + crystal.phase) * 0.2 + 0.6;
            ctx.globalAlpha = crystal.brightness * pulse;
            ctx.fillStyle = palette.crystal;
            // Crystal shape (elongated diamond)
            ctx.fillRect(sx, sy - crystal.height / 2, crystal.width, crystal.height);
            ctx.fillRect(sx - 1, sy - crystal.height / 4, crystal.width + 2, crystal.height / 2);
            // Bright top
            ctx.fillStyle = palette.crystalBright;
            ctx.globalAlpha = crystal.brightness * pulse * 0.5;
            ctx.fillRect(sx, sy - crystal.height / 2, crystal.width, 2);
        }
        ctx.globalAlpha = 1;

        // Network visualization (after directive reveal)
        if (this.phase === 'network' || this.directiveFlash > 0) {
            r.drawMindNetwork(this.networkNodes, this.player.x, this.player.y, palette, time);
        }

        // Shadow
        this.shadow.render(ctx, r, palette, time);

        // Player
        this.player.render(ctx, r, palette, time);

        // DIRECTIVE TEXT (large, centered, burning)
        if (this.directiveText) {
            const directiveY = CONFIG.HEIGHT / 2 - 40;
            const glow = Math.sin(time * 4) * 0.2 + 0.8;

            // Glow behind text
            r.drawGlow(CONFIG.WIDTH / 2, directiveY + 4, 60, palette.directive, 0.15 * glow);

            // Text
            ctx.globalAlpha = glow;
            r.drawTextCentered(this.directiveText, directiveY, palette.directive, 2);

            // Underline
            const tw = r.measureText(this.directiveText, 2);
            ctx.fillStyle = palette.directiveGlow;
            ctx.globalAlpha = glow * 0.5;
            ctx.fillRect((CONFIG.WIDTH - tw) / 2, directiveY + 16, tw, 1);
            ctx.globalAlpha = 1;
        }

        // Directive flash
        if (this.directiveFlash > 0) {
            r.drawFlash(palette.directive, this.directiveFlash * 0.3);
        }

        // Dialogue
        this.dialogue.render(ctx, time);
    }
}
