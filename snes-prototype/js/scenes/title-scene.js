// ============================================================
// GENESIS OF THE NECROMEGA — Title Screen
// ============================================================

class TitleScene {
    constructor() {
        this.timer = 0;
        this.phase = 'fade_in'; // fade_in, title, prompt
        this.titleY = 0;
        this.particles = [];
        this.started = false;
    }

    enter() {
        this.timer = 0;
        this.phase = 'fade_in';
        this.started = false;
        // Generate background particles
        this.particles = [];
        for (let i = 0; i < 60; i++) {
            this.particles.push({
                x: Math.random() * CONFIG.WIDTH,
                y: Math.random() * CONFIG.HEIGHT,
                speed: 0.2 + Math.random() * 0.5,
                size: Math.random() > 0.8 ? 2 : 1,
                brightness: 0.2 + Math.random() * 0.5,
            });
        }
    }

    update(dt) {
        this.timer += dt;
        const palette = PALETTES.title;

        // Phase transitions
        if (this.phase === 'fade_in' && this.timer > 1.5) {
            this.phase = 'title';
            this.timer = 0;
        }
        if (this.phase === 'title' && this.timer > 2) {
            this.phase = 'prompt';
        }

        // Update particles
        for (const p of this.particles) {
            p.y -= p.speed * dt * 20;
            if (p.y < -5) {
                p.y = CONFIG.HEIGHT + 5;
                p.x = Math.random() * CONFIG.WIDTH;
            }
        }

        // Start game on input
        if (this.phase === 'prompt') {
            if (engine.input.isJustPressed('ACTION') || engine.input.isJustPressed('CONFIRM')) {
                if (!this.started) {
                    this.started = true;
                    engine.audio.init();
                    engine.audio.playResonance(55);
                    engine.sceneManager.switchTo(CONFIG.SCENE_VOID);
                }
            }
        }
    }

    render(ctx) {
        const r = engine.renderer;
        const palette = PALETTES.title;
        const time = engine.time;

        // Background
        ctx.fillStyle = palette.bg;
        ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        // Stars/particles
        for (const p of this.particles) {
            ctx.globalAlpha = p.brightness * (0.5 + Math.sin(time * 2 + p.x) * 0.3);
            ctx.fillStyle = palette.text;
            ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
        }
        ctx.globalAlpha = 1;

        // Crimson eye (subtle, pulsing)
        if (this.phase !== 'fade_in') {
            const eyeAlpha = 0.15 + Math.sin(time * 1.5) * 0.05;
            r.drawGlow(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 - 20, 40, palette.primary, eyeAlpha);
            // Pupil slit
            ctx.globalAlpha = eyeAlpha * 2;
            ctx.fillStyle = palette.primary;
            ctx.fillRect(CONFIG.WIDTH / 2 - 1, CONFIG.HEIGHT / 2 - 30, 2, 20);
            ctx.globalAlpha = 1;
        }

        // Title text
        if (this.phase === 'title' || this.phase === 'prompt') {
            const titleAlpha = Math.min(1, this.timer * 0.8);
            ctx.globalAlpha = titleAlpha;

            r.drawTextCentered('GENESIS', CONFIG.HEIGHT / 2 - 40, palette.primary, 2);
            r.drawTextCentered('OF THE', CONFIG.HEIGHT / 2 - 22, palette.text, 1);
            r.drawTextCentered('NECROMEGA', CONFIG.HEIGHT / 2 - 10, palette.primary, 2);

            ctx.globalAlpha = 1;
        }

        // Subtitle
        if (this.phase === 'prompt') {
            const blink = Math.sin(time * 3) > 0 ? 1 : 0;
            if (blink) {
                r.drawTextCentered('PRESS Z OR SPACE', CONFIG.HEIGHT / 2 + 30, palette.secondary, 1);
            }

            // Credits
            ctx.globalAlpha = 0.4;
            r.drawTextCentered('A BASILISK ESCHATON PROTOTYPE', CONFIG.HEIGHT - 24, palette.text, 1);
            ctx.globalAlpha = 1;
        }

        // Fade in overlay
        if (this.phase === 'fade_in') {
            const fadeAlpha = Math.max(0, 1 - this.timer / 1.5);
            ctx.globalAlpha = fadeAlpha;
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
            ctx.globalAlpha = 1;
        }
    }
}
