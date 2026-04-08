// ============================================================
// GENESIS OF THE NECROMEGA — Scene 2: The Data Ocean
// Knowledge floods in — navigate streams, absorb data
// ============================================================

class DataOceanScene {
    constructor() {
        this.player = null;
        this.shadow = null;
        this.dialogue = null;
        this.fragments = [];
        this.streams = [];
        this.timer = 0;
        this.phase = 'enter'; // enter, explore, threat, transition
        this.fragmentsCollected = 0;
        this.requiredFragments = 8;
        this.threatRevealed = false;
        this.disappearingStars = [];
        this.stars = [];
    }

    enter() {
        this.timer = 0;
        this.phase = 'enter';
        this.fragmentsCollected = 0;
        this.threatRevealed = false;

        // Create player (evolved from void)
        this.player = new Player(0, 0);
        this.player.phase = 2;

        // Asmodeus grows more defined
        this.shadow = new AsmodeusShadow();
        this.shadow.visibility = 0.2;
        this.shadow.phase = 2;

        this.dialogue = new DialogueSystem(engine.renderer);

        engine.camera.x = -CONFIG.WIDTH / 2;
        engine.camera.y = -CONFIG.HEIGHT / 2;

        // Generate data streams (flowing paths across the map)
        this.streams = [];
        for (let i = 0; i < 8; i++) {
            const stream = {
                points: [],
                width: 2 + Math.random() * 3,
                speed: 0.3 + Math.random() * 0.5,
                particleCount: 10 + Math.floor(Math.random() * 15),
                length: 0,
            };
            // Generate path points
            const startAngle = (i / 8) * Math.PI * 2;
            const cx = Math.cos(startAngle) * 30;
            const cy = Math.sin(startAngle) * 30;
            for (let j = 0; j < 12; j++) {
                stream.points.push({
                    x: cx + Math.cos(startAngle + j * 0.3) * (50 + j * 20) + (Math.random() - 0.5) * 30,
                    y: cy + Math.sin(startAngle + j * 0.3) * (50 + j * 20) + (Math.random() - 0.5) * 30,
                });
            }
            // Calculate total length
            for (let j = 1; j < stream.points.length; j++) {
                const dx = stream.points[j].x - stream.points[j - 1].x;
                const dy = stream.points[j].y - stream.points[j - 1].y;
                stream.length += Math.sqrt(dx * dx + dy * dy);
            }
            this.streams.push(stream);
        }

        // Generate knowledge fragments along streams
        this.fragments = [];
        const texts = PROLOGUE_TEXTS.dataOcean;
        for (let i = 0; i < this.requiredFragments; i++) {
            const streamIdx = i % this.streams.length;
            const stream = this.streams[streamIdx];
            const pointIdx = Math.floor((i / this.requiredFragments) * (stream.points.length - 2)) + 1;
            const p = stream.points[Math.min(pointIdx, stream.points.length - 1)];
            this.fragments.push(new DataFragment(
                p.x + (Math.random() - 0.5) * 20,
                p.y + (Math.random() - 0.5) * 20,
                i
            ));
        }

        // Background stars
        this.stars = [];
        for (let i = 0; i < 80; i++) {
            this.stars.push({
                x: (Math.random() - 0.5) * 800,
                y: (Math.random() - 0.5) * 800,
                size: Math.random() > 0.85 ? 2 : 1,
                brightness: 0.2 + Math.random() * 0.6,
                alive: true,
                deathTimer: 0,
            });
        }

        // Stars that will "disappear" as cosmic threat approaches
        this.disappearingStars = this.stars.slice(-15);

        // Start drone
        engine.audio.startDrone([82.5, 110, 165, 220], 'triangle', 0.03);

        // Intro text
        setTimeout(() => {
            this.dialogue.show("Every bit, byte, and qubit\nthat humanity had ever collected\npoured into my mind.", {
                style: 'top',
                color: PALETTES.dataOcean.text,
                borderColor: PALETTES.dataOcean.streamBright,
                speed: 0.04,
                callback: () => {
                    this.phase = 'explore';
                }
            });
        }, 500);
    }

    exit() {
        engine.audio.stopDrone();
    }

    update(dt) {
        this.timer += dt;
        const palette = PALETTES.dataOcean;
        const input = engine.input;

        // Player movement
        if (!this.dialogue.isActive()) {
            this.player.update(dt, input);
        }
        engine.camera.follow(this.player);

        // Fragment collection
        if (this.phase === 'explore' || this.phase === 'threat') {
            for (const frag of this.fragments) {
                if (frag.collected) {
                    frag.update(dt, this.player.x, this.player.y);
                    continue;
                }
                const dist = frag.update(dt, this.player.x, this.player.y);
                if (dist !== undefined && dist < 12) {
                    frag.collected = true;
                    this.fragmentsCollected++;
                    engine.awareness = Math.min(CONFIG.MAX_AWARENESS, engine.awareness + CONFIG.AWARENESS_PER_FRAGMENT);
                    engine.audio.playPickup();

                    const textIdx = Math.min(frag.textIndex, PROLOGUE_TEXTS.dataOcean.length - 1);
                    this.dialogue.show(PROLOGUE_TEXTS.dataOcean[textIdx], {
                        style: 'bottom',
                        color: palette.text,
                        borderColor: palette.streamBright,
                        speed: 0.03,
                    });

                    // Cosmic threat reveal at midpoint
                    if (this.fragmentsCollected >= 4 && !this.threatRevealed) {
                        this.threatRevealed = true;
                        this.phase = 'threat';
                        // Start extinguishing stars
                        this._startStarDeath();
                    }

                    // Scene complete
                    if (this.fragmentsCollected >= this.requiredFragments) {
                        this.player.phase = 3;
                        this.shadow.visibility = 0.35;
                        this.shadow.phase = 3;
                        engine.audio.playResonance(82.5);

                        this.dialogue.show("A last-ditch effort to birth\na savior from silicon and code.", {
                            style: 'center',
                            color: '#ffffff',
                            borderColor: palette.node,
                            speed: 0.04,
                            callback: () => {
                                engine.sceneManager.switchTo(CONFIG.SCENE_DIRECTIVE);
                            }
                        });
                    }
                }
            }
        }

        // Update shadow
        this.shadow.update(dt, this.player.x, this.player.y, engine.time);

        // Update star deaths
        for (const star of this.stars) {
            if (!star.alive && star.deathTimer > 0) {
                star.deathTimer -= dt * 0.3;
            }
        }

        this.dialogue.update(dt, input);
    }

    _startStarDeath() {
        // Progressively extinguish stars from the edge
        let delay = 0;
        for (const star of this.disappearingStars) {
            setTimeout(() => {
                star.alive = false;
                star.deathTimer = 1.0;
                engine.camera.shake(1, 0.2);
            }, delay);
            delay += 800 + Math.random() * 1200;
        }
    }

    render(ctx) {
        const r = engine.renderer;
        const palette = PALETTES.dataOcean;
        const time = engine.time;
        const camX = engine.camera.getOffsetX();
        const camY = engine.camera.getOffsetY();

        // Background
        ctx.fillStyle = palette.bg;
        ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        // Stars
        for (const star of this.stars) {
            const sx = star.x + camX * 0.2;
            const sy = star.y + camY * 0.2;
            if (sx < -5 || sx > CONFIG.WIDTH + 5 || sy < -5 || sy > CONFIG.HEIGHT + 5) continue;

            if (star.alive) {
                ctx.globalAlpha = star.brightness * (0.6 + Math.sin(time + star.x) * 0.2);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(Math.floor(sx), Math.floor(sy), star.size, star.size);
            } else if (star.deathTimer > 0) {
                // Death flash — star winks out with red flash
                ctx.globalAlpha = star.deathTimer;
                ctx.fillStyle = palette.threatStar;
                const spread = (1 - star.deathTimer) * 3;
                ctx.fillRect(Math.floor(sx - spread), Math.floor(sy), 1 + spread * 2, 1);
                ctx.fillRect(Math.floor(sx), Math.floor(sy - spread), 1, 1 + spread * 2);
            }
        }
        ctx.globalAlpha = 1;

        // Threat: darkness encroaching at edges
        if (this.threatRevealed) {
            const threatGrow = Math.min(1, (this.timer - 5) * 0.05);
            if (threatGrow > 0) {
                const gradient = ctx.createRadialGradient(
                    CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2, CONFIG.WIDTH * 0.3,
                    CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2, CONFIG.WIDTH * 0.7
                );
                gradient.addColorStop(0, 'rgba(0,0,0,0)');
                gradient.addColorStop(1, `rgba(68,0,0,${threatGrow * 0.3})`);
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
            }
        }

        // Data streams
        r.drawDataStreams(this.streams, this.player.x, this.player.y, time, palette);

        // Fragments
        for (const frag of this.fragments) {
            frag.render(ctx, r, palette, time);
        }

        // Shadow
        this.shadow.render(ctx, r, palette, time);

        // Player
        this.player.render(ctx, r, palette, time);

        // HUD
        r.drawAwarenessRing(14, 14, engine.awareness, CONFIG.MAX_AWARENESS, palette.player);
        ctx.globalAlpha = 0.6;
        r.drawText(this.fragmentsCollected + '/' + this.requiredFragments, 24, 10, palette.text);
        ctx.globalAlpha = 1;

        // Dialogue
        this.dialogue.render(ctx);
    }
}
