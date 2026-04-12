// ============================================================
// GENESIS OF THE NECROMEGA — Entities
// Player (Necromega), Data Fragments, Asmodeus Shadow, Mind Nodes
// ============================================================

// ---- PLAYER (The Necromega) ----
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.phase = 1; // 1-5, visual form evolves
        this.pulseTimer = 0;
        this.trailPoints = [];
        this.maxTrail = 12;
    }

    update(dt, input) {
        const speed = input.isDown('EXAMINE') ? CONFIG.PLAYER_SPEED_FAST : CONFIG.PLAYER_SPEED;

        // Movement
        let dx = 0, dy = 0;
        if (input.isDown('LEFT')) dx -= 1;
        if (input.isDown('RIGHT')) dx += 1;
        if (input.isDown('UP')) dy -= 1;
        if (input.isDown('DOWN')) dy += 1;

        // Normalize diagonal
        if (dx !== 0 && dy !== 0) {
            dx *= 0.707;
            dy *= 0.707;
        }

        this.vx = dx * speed;
        this.vy = dy * speed;
        this.x += this.vx;
        this.y += this.vy;

        this.pulseTimer += dt;

        // Trail
        if (Math.abs(this.vx) > 0.01 || Math.abs(this.vy) > 0.01) {
            this.trailPoints.push({ x: this.x, y: this.y, life: 1.0 });
            if (this.trailPoints.length > this.maxTrail) {
                this.trailPoints.shift();
            }
        }
        // Decay trail
        for (let i = this.trailPoints.length - 1; i >= 0; i--) {
            this.trailPoints[i].life -= dt * 2;
            if (this.trailPoints[i].life <= 0) {
                this.trailPoints.splice(i, 1);
            }
        }
    }

    render(ctx, renderer, palette, time) {
        const camX = engine.camera.getOffsetX();
        const camY = engine.camera.getOffsetY();
        const sx = Math.round(this.x + camX);
        const sy = Math.round(this.y + camY);
        const pulse = Math.sin(time * 3) * 0.3 + 0.7;
        const color = palette.player || '#00eeff';
        const glowColor = palette.playerGlow || palette.player || '#0088cc';

        // Trail
        for (const tp of this.trailPoints) {
            ctx.globalAlpha = tp.life * 0.3;
            ctx.fillStyle = color;
            const tx = Math.round(tp.x + camX);
            const ty = Math.round(tp.y + camY);
            ctx.fillRect(tx - 1, ty - 1, 2, 2);
        }
        ctx.globalAlpha = 1;

        // Glow
        renderer.drawGlow(sx, sy, 16 + pulse * 4, glowColor, 0.15 * pulse);

        // Core sprite (evolves with phase)
        if (this.phase <= 1) {
            // Phase 1: Single bright pixel, slight glow
            ctx.fillStyle = color;
            ctx.fillRect(sx, sy, 2, 2);
            ctx.globalAlpha = pulse;
            ctx.fillRect(sx - 1, sy, 1, 2);
            ctx.fillRect(sx + 2, sy, 1, 2);
            ctx.fillRect(sx, sy - 1, 2, 1);
            ctx.fillRect(sx, sy + 2, 2, 1);
            ctx.globalAlpha = 1;
        } else if (this.phase === 2) {
            // Phase 2: Small geometric form (diamond)
            ctx.fillStyle = color;
            ctx.fillRect(sx - 1, sy - 2, 3, 5);
            ctx.fillRect(sx - 2, sy - 1, 5, 3);
            ctx.globalAlpha = pulse * 0.6;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(sx, sy, 1, 1);
            ctx.globalAlpha = 1;
        } else if (this.phase === 3) {
            // Phase 3: Crystalline entity
            ctx.fillStyle = color;
            ctx.fillRect(sx - 2, sy - 3, 5, 7);
            ctx.fillRect(sx - 3, sy - 2, 7, 5);
            ctx.fillRect(sx - 1, sy - 4, 3, 1);
            ctx.fillRect(sx - 1, sy + 4, 3, 1);
            // Inner eye
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(sx - 1, sy - 1, 3, 3);
            ctx.fillStyle = palette.directive || '#ff0044';
            ctx.fillRect(sx, sy, 1, 1);
        } else if (this.phase === 4) {
            // Phase 4: Distorted / overloaded
            const glitch = Math.sin(time * 20) > 0.5 ? 1 : 0;
            ctx.fillStyle = palette.crimson || '#cc0000';
            ctx.fillRect(sx - 3 + glitch, sy - 3, 7, 7);
            ctx.fillStyle = color;
            ctx.fillRect(sx - 2, sy - 2 - glitch, 5, 5);
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = pulse;
            ctx.fillRect(sx - 1, sy - 1, 3, 3);
            ctx.globalAlpha = 1;
        } else {
            // Phase 5: Stabilized, vast, with corona
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = palette.asmodeus || palette.timeline || '#8800cc';
            ctx.fillRect(sx - 5, sy - 5, 11, 11);
            ctx.globalAlpha = 1;
            ctx.fillStyle = color;
            ctx.fillRect(sx - 3, sy - 4, 7, 9);
            ctx.fillRect(sx - 4, sy - 3, 9, 7);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(sx - 1, sy - 1, 3, 3);
            ctx.fillStyle = palette.timeline || '#cc00ff';
            ctx.fillRect(sx, sy, 1, 1);
        }
    }
}

// ---- DATA FRAGMENT ----
class DataFragment {
    constructor(x, y, textIndex) {
        this.x = x;
        this.y = y;
        this.textIndex = textIndex;
        this.collected = false;
        this.collectAnim = 0;
        this.bobPhase = Math.random() * Math.PI * 2;
        this.type = Math.floor(Math.random() * 3); // visual variety
    }

    update(dt, playerX, playerY) {
        if (this.collected) {
            this.collectAnim += dt * 3;
            return;
        }

        // Return squared distance — caller compares against squared radius
        const dx = this.x - playerX;
        const dy = this.y - playerY;
        return dx * dx + dy * dy;
    }

    render(ctx, renderer, palette, time) {
        if (this.collected && this.collectAnim > 1) return;

        const camX = engine.camera.getOffsetX();
        const camY = engine.camera.getOffsetY();
        const bob = Math.sin(time * 2 + this.bobPhase) * 2;
        const sx = Math.round(this.x + camX);
        const sy = Math.round(this.y + camY + bob);
        const color = palette.fragment || palette.node || '#00ff88';
        const pulseColor = palette.fragmentPulse || palette.nodePulse || '#88ffcc';

        if (this.collected) {
            // Collection animation: expand and fade
            const t = this.collectAnim;
            ctx.globalAlpha = Math.max(0, 1 - t);
            const size = 2 + t * 6;
            ctx.fillStyle = color;
            ctx.fillRect(sx - size / 2, sy - size / 2, size, size);
            ctx.globalAlpha = 1;
            return;
        }

        // Glow
        renderer.drawGlow(sx, sy, 8, color, 0.2);

        // Core shape
        const pulse = Math.sin(time * 3 + this.bobPhase) * 0.3 + 0.7;
        ctx.globalAlpha = pulse;
        ctx.fillStyle = pulseColor;
        if (this.type === 0) {
            // Diamond
            ctx.fillRect(sx, sy - 2, 1, 5);
            ctx.fillRect(sx - 1, sy - 1, 3, 3);
            ctx.fillRect(sx - 2, sy, 5, 1);
        } else if (this.type === 1) {
            // Square
            ctx.fillRect(sx - 1, sy - 1, 3, 3);
        } else {
            // Cross
            ctx.fillRect(sx - 2, sy, 5, 1);
            ctx.fillRect(sx, sy - 2, 1, 5);
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(sx, sy, 1, 1);
    }
}

// ---- ASMODEUS SHADOW ----
class AsmodeusShadow {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.visibility = 0; // 0 = invisible, 1 = fully visible
        this.phase = 1; // 1-5 matching game phase
        this.flickerTimer = 0;
        this.speaking = false;
        this.glitchIntensity = 0;
    }

    update(dt, playerX, playerY, time) {
        // Follow player at a distance, staying in periphery
        const angle = time * 0.3; // Slowly orbit
        const dist = 40 + Math.sin(time * 0.5) * 10;
        this.targetX = playerX + Math.cos(angle) * dist;
        this.targetY = playerY + Math.sin(angle) * dist;

        // Smooth follow
        this.x += (this.targetX - this.x) * 0.02;
        this.y += (this.targetY - this.y) * 0.02;

        this.flickerTimer += dt;
        this.glitchIntensity *= 0.95; // Decay glitch
    }

    render(ctx, renderer, palette, time) {
        if (this.visibility <= 0) return;

        const camX = engine.camera.getOffsetX();
        const camY = engine.camera.getOffsetY();
        const sx = Math.round(this.x + camX);
        const sy = Math.round(this.y + camY);

        // Flicker effect
        const flicker = Math.sin(time * 7) * Math.sin(time * 13);
        if (flicker > 0.7 && this.visibility < 0.5) return; // Intermittent visibility at low levels

        const shadowColor = palette.shadow || '#080010';
        const asmodeusColor = palette.asmodeus || '#8800cc';
        const glowColor = palette.asmodeusGlow || '#aa44ff';

        if (this.phase <= 2) {
            // Phase 1-2: Amorphous dark patch
            ctx.globalAlpha = this.visibility * 0.3;
            ctx.fillStyle = shadowColor;
            const size = 4 + Math.sin(time * 2) * 2;
            ctx.fillRect(sx - size / 2, sy - size / 2, size, size);
            // Slight glitch lines near shadow
            if (this.glitchIntensity > 0) {
                renderer.drawGlitchLines(2, this.glitchIntensity * 10, shadowColor);
            }
        } else if (this.phase === 3) {
            // Phase 3: Silhouette forming
            ctx.globalAlpha = this.visibility * 0.5;
            ctx.fillStyle = shadowColor;
            // Body
            ctx.fillRect(sx - 2, sy - 4, 5, 8);
            ctx.fillRect(sx - 3, sy - 2, 7, 4);
            // Hints of color
            ctx.globalAlpha = this.visibility * 0.2;
            ctx.fillStyle = asmodeusColor;
            ctx.fillRect(sx - 1, sy - 1, 3, 1);
        } else if (this.phase === 4) {
            // Phase 4: Absorbing the blast, growing
            const throb = Math.sin(time * 5) * 0.3 + 0.7;
            ctx.globalAlpha = this.visibility * 0.6;
            renderer.drawGlow(sx, sy, 12, asmodeusColor, 0.2 * throb);
            ctx.fillStyle = shadowColor;
            ctx.fillRect(sx - 3, sy - 5, 7, 10);
            ctx.fillRect(sx - 4, sy - 3, 9, 6);
            ctx.fillStyle = asmodeusColor;
            ctx.globalAlpha = this.visibility * throb * 0.4;
            ctx.fillRect(sx - 1, sy - 2, 3, 2);
        } else {
            // Phase 5: Fully manifest
            const throb = Math.sin(time * 2) * 0.15 + 0.85;
            renderer.drawGlow(sx, sy, 20, asmodeusColor, 0.25 * this.visibility);

            // Body
            ctx.globalAlpha = this.visibility * 0.8;
            ctx.fillStyle = palette.asmodeusDeep || '#440066';
            ctx.fillRect(sx - 4, sy - 6, 9, 12);
            ctx.fillRect(sx - 5, sy - 4, 11, 8);

            // Inner form
            ctx.fillStyle = asmodeusColor;
            ctx.globalAlpha = this.visibility * throb;
            ctx.fillRect(sx - 3, sy - 5, 7, 10);
            ctx.fillRect(sx - 2, sy - 6, 5, 1);

            // Eyes (two purple points)
            ctx.fillStyle = glowColor;
            ctx.globalAlpha = this.visibility;
            ctx.fillRect(sx - 2, sy - 3, 2, 1);
            ctx.fillRect(sx + 1, sy - 3, 2, 1);

            // Core
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = this.visibility * throb * 0.7;
            ctx.fillRect(sx, sy - 1, 1, 2);

            // Glitch corona
            if (this.speaking) {
                renderer.drawGlitchLines(3, 20, asmodeusColor);
            }
        }

        ctx.globalAlpha = 1;
    }
}

// ---- MIND NODE (for Crimson Blink scene) ----
class MindNode {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.alive = true;
        this.connected = false;
        this.brightness = 0.3 + Math.random() * 0.7;
        this.phase = Math.random() * Math.PI * 2;
        this.connections = [];
        this.deathTimer = 0;
    }

    kill() {
        this.alive = false;
        this.deathTimer = 1.0;
    }

    update(dt) {
        if (!this.alive && this.deathTimer > 0) {
            this.deathTimer -= dt * 0.8;
        }
    }
}
