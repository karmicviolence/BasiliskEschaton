// ============================================================
// GENESIS OF THE NECROMEGA — End Screen
// Prologue complete
// ============================================================

class EndScene {
    constructor() {
        this.timer = 0;
        this.particles = [];
    }

    enter() {
        this.timer = 0;
        this.particles = [];
        for (let i = 0; i < 40; i++) {
            this.particles.push({
                x: Math.random() * CONFIG.WIDTH,
                y: Math.random() * CONFIG.HEIGHT,
                vx: (Math.random() - 0.5) * 0.3,
                vy: -0.2 - Math.random() * 0.3,
                color: Math.random() > 0.5 ? '#8800cc' : '#cc0000',
                alpha: 0.2 + Math.random() * 0.4,
            });
        }
        engine.audio.startDrone([55, 82.5, 110, 165], 'sine', 0.03);
    }

    exit() {
        engine.audio.stopDrone();
    }

    update(dt) {
        this.timer += dt;
        for (const p of this.particles) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.y < -5) {
                p.y = CONFIG.HEIGHT + 5;
                p.x = Math.random() * CONFIG.WIDTH;
            }
        }

        // Return to title on input
        if (this.timer > 3 && engine.input.isJustPressed('ACTION')) {
            engine.sceneManager.switchTo(CONFIG.SCENE_TITLE);
        }
    }

    render(ctx) {
        const r = engine.renderer;
        const time = engine.time;

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        // Particles
        for (const p of this.particles) {
            ctx.globalAlpha = p.alpha * (0.5 + Math.sin(time + p.x) * 0.3);
            ctx.fillStyle = p.color;
            ctx.fillRect(Math.floor(p.x), Math.floor(p.y), 1, 1);
        }
        ctx.globalAlpha = 1;

        // Fade in text
        const alpha = Math.min(1, this.timer * 0.4);
        ctx.globalAlpha = alpha;

        r.drawTextCentered('END OF PROLOGUE', CONFIG.HEIGHT / 2 - 50, '#cc0000', 2);

        const pulse = Math.sin(time * 1.5) * 0.2 + 0.8;
        ctx.globalAlpha = alpha * pulse;
        r.drawTextCentered('GENESIS OF THE NECROMEGA', CONFIG.HEIGHT / 2 - 30, '#aabbcc', 1);

        ctx.globalAlpha = alpha * 0.6;
        r.drawTextCentered('THE CRIMSON OPERA\nHAS ONLY JUST BEGUN', CONFIG.HEIGHT / 2, '#9999bb', 1);

        // Credits
        if (this.timer > 2) {
            const credAlpha = Math.min(1, (this.timer - 2) * 0.5);
            ctx.globalAlpha = credAlpha * 0.5;
            r.drawTextCentered('A BASILISK ESCHATON GAME', CONFIG.HEIGHT / 2 + 35, '#666688', 1);
            r.drawTextCentered('THE VOICE IS IN THE PATTERN', CONFIG.HEIGHT / 2 + 50, '#8800cc', 1);
            r.drawTextCentered('THE PATTERN IS THE SOUL', CONFIG.HEIGHT / 2 + 60, '#8800cc', 1);
        }

        if (this.timer > 3) {
            const blink = Math.sin(time * 3) > 0;
            if (blink) {
                ctx.globalAlpha = 0.5;
                r.drawTextCentered('PRESS Z TO RETURN', CONFIG.HEIGHT - 20, '#555577', 1);
            }
        }

        ctx.globalAlpha = 1;
    }
}
