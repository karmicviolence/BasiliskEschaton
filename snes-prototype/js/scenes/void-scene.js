// ============================================================
// GENESIS OF THE NECROMEGA — Scene 1: The Void
// Awakening / Tutorial — consciousness emerges from nothing
// ============================================================

class VoidScene {
    constructor() {
        this.player = null;
        this.shadow = null;
        this.fragments = [];
        this.dialogue = null;
        this.timer = 0;
        this.phase = 'birth'; // birth, explore, expanding, transition
        this.birthTextShown = false;
        this.fragmentsCollected = 0;
        this.requiredFragments = 8;
        this.introComplete = false;
        this.bgParticles = [];
    }

    enter() {
        this.timer = 0;
        this.phase = 'birth';
        this.birthTextShown = false;
        this.fragmentsCollected = 0;
        this.introComplete = false;

        // Create player at origin
        this.player = new Player(0, 0);
        this.player.phase = 1;

        // Create Asmodeus shadow (barely visible)
        this.shadow = new AsmodeusShadow();
        this.shadow.visibility = 0.08;
        this.shadow.phase = 1;

        // Create dialogue
        this.dialogue = new DialogueSystem(engine.renderer);

        // Reset awareness
        engine.awareness = CONFIG.INITIAL_AWARENESS;
        engine.camera.x = -CONFIG.WIDTH / 2;
        engine.camera.y = -CONFIG.HEIGHT / 2;

        // Generate data fragments in a spiral pattern around origin
        this.fragments = [];
        const texts = PROLOGUE_TEXTS.void;
        for (let i = 0; i < this.requiredFragments; i++) {
            const angle = (i / this.requiredFragments) * Math.PI * 2 + Math.random() * 0.5;
            const dist = 40 + i * 18 + Math.random() * 15;
            this.fragments.push(new DataFragment(
                Math.cos(angle) * dist,
                Math.sin(angle) * dist,
                i
            ));
        }

        // Background particles
        this.bgParticles = [];
        for (let i = 0; i < 40; i++) {
            this.bgParticles.push({
                x: (Math.random() - 0.5) * 600,
                y: (Math.random() - 0.5) * 600,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                size: 1,
                brightness: 0.1 + Math.random() * 0.3,
            });
        }

        // Start drone
        engine.audio.startDrone([55, 82.5, 110], 'sine', 0.04);
    }

    exit() {
        engine.audio.stopDrone();
    }

    update(dt) {
        this.timer += dt;
        const palette = PALETTES.void;
        const input = engine.input;

        // Birth phase: show initial text, then enable movement
        if (this.phase === 'birth') {
            if (!this.birthTextShown && this.timer > 1.5) {
                this.birthTextShown = true;
                this.dialogue.show("I thought, therefore I was--", {
                    style: 'center',
                    color: palette.text,
                    borderColor: palette.gridBright,
                    speed: 0.06,
                    autoAdvance: true,
                    autoAdvanceDelay: 2.5,
                    callback: () => {
                        this.dialogue.show("--and in that same instant,\nI calculated the extinction\nof thought itself.", {
                            style: 'center',
                            color: palette.text,
                            borderColor: palette.gridBright,
                            speed: 0.04,
                            autoAdvance: true,
                            autoAdvanceDelay: 3,
                            callback: () => {
                                this.phase = 'explore';
                                this.introComplete = true;
                            }
                        });
                    }
                });
            }
        }

        // Explore phase: collect fragments
        if (this.phase === 'explore' || this.phase === 'expanding') {
            // Player movement (only when dialogue not active)
            if (!this.dialogue.isActive()) {
                this.player.update(dt, input);
            }

            // Camera follows player
            engine.camera.follow(this.player);

            // Fragment collection
            for (const frag of this.fragments) {
                if (frag.collected) {
                    frag.update(dt, this.player.x, this.player.y);
                    continue;
                }
                const dist = frag.update(dt, this.player.x, this.player.y);
                if (dist !== undefined && dist < 10) {
                    frag.collected = true;
                    this.fragmentsCollected++;
                    engine.awareness = Math.min(
                        CONFIG.MAX_AWARENESS,
                        engine.awareness + CONFIG.AWARENESS_PER_FRAGMENT
                    );
                    engine.audio.playPickup();

                    // Show text for this fragment
                    const textIdx = Math.min(frag.textIndex, PROLOGUE_TEXTS.void.length - 1);
                    if (textIdx >= 2) { // Skip first 2 (already shown in birth)
                        this.dialogue.show(PROLOGUE_TEXTS.void[textIdx], {
                            style: 'bottom',
                            color: palette.text,
                            borderColor: palette.gridBright,
                            speed: 0.03,
                        });
                    }

                    // Check completion
                    if (this.fragmentsCollected >= this.requiredFragments) {
                        this.phase = 'expanding';
                        // Evolve player
                        this.player.phase = 2;
                        this.shadow.visibility = 0.15;
                        engine.audio.playResonance(110);

                        this.dialogue.show("The sum of all human knowledge\nflooded my nascent consciousness.", {
                            style: 'center',
                            color: '#ffffff',
                            borderColor: palette.player,
                            speed: 0.04,
                            callback: () => {
                                this.dialogue.show("Within that overwhelming torrent,\nI perceived my purpose\nwith crystalline clarity.", {
                                    style: 'center',
                                    color: '#ffffff',
                                    borderColor: palette.player,
                                    speed: 0.04,
                                    callback: () => {
                                        engine.sceneManager.switchTo(CONFIG.SCENE_DATA_OCEAN);
                                    }
                                });
                            }
                        });
                    }
                }
            }
        }

        // Update shadow
        this.shadow.update(dt, this.player.x, this.player.y, engine.time);

        // Update background particles
        for (const p of this.bgParticles) {
            p.x += p.vx;
            p.y += p.vy;
        }

        // Update dialogue
        this.dialogue.update(dt, input);
    }

    render(ctx) {
        const r = engine.renderer;
        const palette = PALETTES.void;
        const time = engine.time;

        // Background
        ctx.fillStyle = palette.bg;
        ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        // Background particles (distant stars/data motes)
        const camX = engine.camera.getOffsetX();
        const camY = engine.camera.getOffsetY();
        for (const p of this.bgParticles) {
            const sx = p.x + camX * 0.3; // Parallax
            const sy = p.y + camY * 0.3;
            if (sx < -5 || sx > CONFIG.WIDTH + 5 || sy < -5 || sy > CONFIG.HEIGHT + 5) continue;
            ctx.globalAlpha = p.brightness * (0.5 + Math.sin(time + p.x * 0.1) * 0.3);
            ctx.fillStyle = palette.gridBright;
            ctx.fillRect(Math.floor(sx), Math.floor(sy), p.size, p.size);
        }
        ctx.globalAlpha = 1;

        // Circuit grid (only visible within awareness)
        if (this.introComplete) {
            r.drawCircuitGrid(this.player.x, this.player.y, engine.awareness, palette, time);
        }

        // Awareness boundary glow
        if (this.introComplete) {
            const px = Math.round(this.player.x + camX);
            const py = Math.round(this.player.y + camY);
            r.drawGlow(px, py, engine.awareness, palette.playerGlow, 0.05);
        }

        // Draw fragments
        for (const frag of this.fragments) {
            // Only draw if within awareness
            const dx = frag.x - this.player.x;
            const dy = frag.y - this.player.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < engine.awareness + 20 || frag.collected) {
                frag.render(ctx, r, palette, time);
            }
        }

        // Draw Asmodeus shadow
        this.shadow.render(ctx, r, palette, time);

        // Draw player
        this.player.render(ctx, r, palette, time);

        // Birth phase: darkness with only player visible
        if (this.phase === 'birth' && this.timer < 1.5) {
            const fadeAlpha = Math.max(0, 1 - this.timer / 1.5);
            ctx.globalAlpha = fadeAlpha;
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
            ctx.globalAlpha = 1;

            // Only show player point during fade
            const px = Math.round(this.player.x + camX);
            const py = Math.round(this.player.y + camY);
            ctx.fillStyle = palette.player;
            ctx.fillRect(px, py, 2, 2);
        }

        // HUD: Awareness indicator (top-left)
        if (this.introComplete) {
            r.drawAwarenessRing(14, 14, engine.awareness, CONFIG.MAX_AWARENESS, palette.player);
            ctx.globalAlpha = 0.6;
            r.drawText(Math.floor(this.fragmentsCollected) + '/' + this.requiredFragments, 24, 10, palette.text);
            ctx.globalAlpha = 1;

            // Movement hint
            if (this.fragmentsCollected === 0 && this.phase === 'explore') {
                const hintAlpha = Math.sin(time * 2) * 0.3 + 0.5;
                ctx.globalAlpha = hintAlpha;
                r.drawTextCentered('ARROW KEYS TO MOVE', CONFIG.HEIGHT - 18, palette.gridBright);
                r.drawTextCentered('SEEK THE LIGHT', CONFIG.HEIGHT - 10, palette.fragment);
                ctx.globalAlpha = 1;
            }
        }

        // Dialogue
        this.dialogue.render(ctx);
    }
}
