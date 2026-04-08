// ============================================================
// GENESIS OF THE NECROMEGA — Renderer
// SNES-style rendering utilities, effects, tile drawing
// ============================================================

class Renderer {
    constructor(ctx) {
        this.ctx = ctx;
    }

    // ---- PIXEL FONT ----
    // Minimal 5x5 pixel font for SNES-style text
    static FONT_CHARS = {
        'A': [0x7C,0x12,0x12,0x7C,0x00], 'B': [0x7E,0x4A,0x4A,0x34,0x00],
        'C': [0x3C,0x42,0x42,0x24,0x00], 'D': [0x7E,0x42,0x42,0x3C,0x00],
        'E': [0x7E,0x4A,0x4A,0x42,0x00], 'F': [0x7E,0x0A,0x0A,0x02,0x00],
        'G': [0x3C,0x42,0x52,0x34,0x00], 'H': [0x7E,0x08,0x08,0x7E,0x00],
        'I': [0x42,0x7E,0x42,0x00,0x00], 'J': [0x20,0x40,0x42,0x3E,0x00],
        'K': [0x7E,0x08,0x14,0x62,0x00], 'L': [0x7E,0x40,0x40,0x40,0x00],
        'M': [0x7E,0x04,0x08,0x04,0x7E], 'N': [0x7E,0x04,0x08,0x7E,0x00],
        'O': [0x3C,0x42,0x42,0x3C,0x00], 'P': [0x7E,0x12,0x12,0x0C,0x00],
        'Q': [0x3C,0x42,0x62,0xBC,0x00], 'R': [0x7E,0x12,0x12,0x6C,0x00],
        'S': [0x44,0x4A,0x4A,0x32,0x00], 'T': [0x02,0x7E,0x02,0x00,0x00],
        'U': [0x3E,0x40,0x40,0x3E,0x00], 'V': [0x1E,0x20,0x40,0x20,0x1E],
        'W': [0x7E,0x20,0x10,0x20,0x7E], 'X': [0x66,0x18,0x18,0x66,0x00],
        'Y': [0x06,0x08,0x70,0x08,0x06], 'Z': [0x62,0x52,0x4A,0x46,0x00],
        '0': [0x3C,0x52,0x4A,0x3C,0x00], '1': [0x44,0x7E,0x40,0x00,0x00],
        '2': [0x64,0x52,0x52,0x4C,0x00], '3': [0x42,0x4A,0x4A,0x36,0x00],
        '4': [0x1E,0x10,0x10,0x7E,0x00], '5': [0x4E,0x4A,0x4A,0x32,0x00],
        '6': [0x3C,0x4A,0x4A,0x30,0x00], '7': [0x02,0x72,0x0A,0x06,0x00],
        '8': [0x34,0x4A,0x4A,0x34,0x00], '9': [0x0C,0x52,0x52,0x3C,0x00],
        '.': [0x40,0x00,0x00,0x00,0x00], ',': [0x80,0x40,0x00,0x00,0x00],
        ':': [0x28,0x00,0x00,0x00,0x00], '!': [0x5E,0x00,0x00,0x00,0x00],
        '?': [0x04,0x52,0x0A,0x04,0x00], '-': [0x08,0x08,0x08,0x00,0x00],
        '\'': [0x06,0x00,0x00,0x00,0x00], '"': [0x06,0x00,0x06,0x00,0x00],
        ' ': [0x00,0x00,0x00,0x00,0x00],
    };

    // Draw pixel text (SNES-style bitmap font)
    drawText(text, x, y, color = '#ffffff', scale = 1) {
        const ctx = this.ctx;
        ctx.fillStyle = color;
        const charWidth = 6 * scale;
        const lineHeight = 8 * scale;
        let cx = x;
        let cy = y;

        for (let i = 0; i < text.length; i++) {
            const ch = text[i].toUpperCase();
            if (ch === '\n') {
                cx = x;
                cy += lineHeight;
                continue;
            }
            const bitmap = Renderer.FONT_CHARS[ch];
            if (bitmap) {
                for (let col = 0; col < bitmap.length; col++) {
                    for (let row = 0; row < 7; row++) {
                        if (bitmap[col] & (1 << row)) {
                            ctx.fillRect(
                                cx + col * scale,
                                cy + row * scale,
                                scale, scale
                            );
                        }
                    }
                }
            }
            cx += charWidth;
        }
    }

    // Measure text width in pixels
    measureText(text, scale = 1) {
        const charWidth = 6 * scale;
        let maxWidth = 0;
        let currentWidth = 0;
        for (let i = 0; i < text.length; i++) {
            if (text[i] === '\n') {
                maxWidth = Math.max(maxWidth, currentWidth);
                currentWidth = 0;
            } else {
                currentWidth += charWidth;
            }
        }
        return Math.max(maxWidth, currentWidth);
    }

    // Count lines
    countLines(text) {
        return text.split('\n').length;
    }

    // Draw centered text
    drawTextCentered(text, y, color = '#ffffff', scale = 1) {
        const lines = text.split('\n');
        const lineHeight = 8 * scale;
        for (let i = 0; i < lines.length; i++) {
            const w = this.measureText(lines[i], scale);
            this.drawText(lines[i], Math.floor((CONFIG.WIDTH - w) / 2), y + i * lineHeight, color, scale);
        }
    }

    // ---- SNES DIALOGUE BOX ----
    drawDialogueBox(x, y, w, h, borderColor = '#aaccff', bgColor = 'rgba(0,0,20,0.9)') {
        const ctx = this.ctx;
        // Background
        ctx.fillStyle = bgColor;
        ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
        // Border (double-line SNES style)
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
        ctx.strokeRect(x + 2.5, y + 2.5, w - 5, h - 5);
    }

    // ---- EFFECTS ----

    // Draw a glowing circle (awareness field, entity glow)
    drawGlow(x, y, radius, color, alpha = 0.3) {
        const ctx = this.ctx;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, this.hexToRGBA(color, alpha));
        gradient.addColorStop(0.5, this.hexToRGBA(color, alpha * 0.4));
        gradient.addColorStop(1, this.hexToRGBA(color, 0));
        ctx.fillStyle = gradient;
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }

    // Draw circuit-board grid pattern
    drawCircuitGrid(ox, oy, awareness, palette, time) {
        const ctx = this.ctx;
        const ts = CONFIG.TILE_SIZE;

        // Calculate visible tile range
        const startTX = Math.floor((ox - CONFIG.WIDTH / 2) / ts) - 1;
        const endTX = Math.ceil((ox + CONFIG.WIDTH / 2) / ts) + 1;
        const startTY = Math.floor((oy - CONFIG.HEIGHT / 2) / ts) - 1;
        const endTY = Math.ceil((oy + CONFIG.HEIGHT / 2) / ts) + 1;

        for (let tx = startTX; tx <= endTX; tx++) {
            for (let ty = startTY; ty <= endTY; ty++) {
                const wx = tx * ts;
                const wy = ty * ts;
                const dx = wx - ox;
                const dy = wy - oy;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist > awareness + 16) continue;

                // Fade at edge of awareness
                let alpha = 1;
                if (dist > awareness - 24) {
                    alpha = Math.max(0, 1 - (dist - (awareness - 24)) / 24);
                }

                // Grid lines
                const screenX = wx + engine.camera.getOffsetX();
                const screenY = wy + engine.camera.getOffsetY();

                ctx.globalAlpha = alpha * 0.3;
                ctx.strokeStyle = palette.grid;
                ctx.lineWidth = 1;
                ctx.strokeRect(screenX + 0.5, screenY + 0.5, ts - 1, ts - 1);

                // Circuit traces (pseudo-random based on tile position)
                const hash = this.tileHash(tx, ty);
                if (hash % 5 === 0) {
                    ctx.globalAlpha = alpha * 0.4;
                    ctx.strokeStyle = palette.circuitActive || palette.gridBright;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    if (hash % 2 === 0) {
                        ctx.moveTo(screenX, screenY + ts / 2);
                        ctx.lineTo(screenX + ts, screenY + ts / 2);
                    } else {
                        ctx.moveTo(screenX + ts / 2, screenY);
                        ctx.lineTo(screenX + ts / 2, screenY + ts);
                    }
                    ctx.stroke();
                }

                // Pulsing nodes at intersections
                if (hash % 11 === 0) {
                    const pulse = Math.sin(time * 2 + hash) * 0.5 + 0.5;
                    ctx.globalAlpha = alpha * pulse * 0.6;
                    ctx.fillStyle = palette.gridBright || palette.circuit;
                    ctx.fillRect(screenX + ts / 2 - 1, screenY + ts / 2 - 1, 2, 2);
                }
            }
        }
        ctx.globalAlpha = 1;
    }

    // Draw flowing data streams
    drawDataStreams(streams, ox, oy, time, palette) {
        const ctx = this.ctx;
        for (const stream of streams) {
            ctx.globalAlpha = 0.4;
            ctx.strokeStyle = palette.stream || '#004466';
            ctx.lineWidth = stream.width || 3;
            ctx.beginPath();

            for (let i = 0; i < stream.points.length; i++) {
                const p = stream.points[i];
                const sx = p.x + engine.camera.getOffsetX();
                const sy = p.y + engine.camera.getOffsetY() + Math.sin(time * stream.speed + i * 0.5) * 2;
                if (i === 0) ctx.moveTo(sx, sy);
                else ctx.lineTo(sx, sy);
            }
            ctx.stroke();

            // Flowing particles along stream
            ctx.globalAlpha = 0.7;
            ctx.fillStyle = palette.particle || palette.streamBright || '#00ddff';
            for (let j = 0; j < stream.particleCount; j++) {
                const t = ((time * stream.speed * 30 + j * (stream.length / stream.particleCount)) % stream.length) / stream.length;
                const idx = Math.floor(t * (stream.points.length - 1));
                const frac = t * (stream.points.length - 1) - idx;
                if (idx < stream.points.length - 1) {
                    const p0 = stream.points[idx];
                    const p1 = stream.points[idx + 1];
                    const px = p0.x + (p1.x - p0.x) * frac + engine.camera.getOffsetX();
                    const py = p0.y + (p1.y - p0.y) * frac + engine.camera.getOffsetY();
                    ctx.fillRect(Math.floor(px), Math.floor(py), 1, 1);
                }
            }
        }
        ctx.globalAlpha = 1;
    }

    // Draw a network of mind-nodes
    drawMindNetwork(nodes, ox, oy, palette, time) {
        const ctx = this.ctx;
        const camX = engine.camera.getOffsetX();
        const camY = engine.camera.getOffsetY();

        // Draw connections first
        ctx.globalAlpha = 0.15;
        ctx.strokeStyle = palette.networkNode || palette.network || '#004488';
        ctx.lineWidth = 1;
        for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i];
            if (!n.alive) continue;
            for (const j of n.connections) {
                if (j > i && nodes[j] && nodes[j].alive) {
                    ctx.beginPath();
                    ctx.moveTo(n.x + camX, n.y + camY);
                    ctx.lineTo(nodes[j].x + camX, nodes[j].y + camY);
                    ctx.stroke();
                }
            }
        }

        // Draw nodes
        for (const n of nodes) {
            const sx = n.x + camX;
            const sy = n.y + camY;
            if (sx < -10 || sx > CONFIG.WIDTH + 10 || sy < -10 || sy > CONFIG.HEIGHT + 10) continue;

            if (n.alive) {
                const pulse = Math.sin(time * 3 + n.phase) * 0.3 + 0.7;
                ctx.globalAlpha = pulse * n.brightness;
                ctx.fillStyle = n.connected ? (palette.crimsonBright || '#ff2200') : (palette.networkAlive || palette.networkNode || '#88ccff');
                ctx.fillRect(sx, sy, 2, 2);
            } else if (n.deathTimer > 0) {
                // Shatter animation
                ctx.globalAlpha = n.deathTimer;
                ctx.fillStyle = palette.shatter || '#ff4400';
                const spread = (1 - n.deathTimer) * 4;
                ctx.fillRect(sx + Math.random() * spread - spread/2, sy + Math.random() * spread - spread/2, 1, 1);
            } else {
                // Dead - dim ember
                ctx.globalAlpha = 0.1;
                ctx.fillStyle = palette.networkDead || '#330000';
                ctx.fillRect(sx, sy, 1, 1);
            }
        }
        ctx.globalAlpha = 1;
    }

    // Horizontal glitch effect
    drawGlitchLines(count, intensity, color = '#ff0044') {
        const ctx = this.ctx;
        for (let i = 0; i < count; i++) {
            const y = Math.floor(Math.random() * CONFIG.HEIGHT);
            const w = Math.random() * intensity;
            const x = Math.random() * CONFIG.WIDTH;
            ctx.globalAlpha = Math.random() * 0.5;
            ctx.fillStyle = color;
            ctx.fillRect(x, y, w, 1);
        }
        ctx.globalAlpha = 1;
    }

    // Full-screen flash
    drawFlash(color, alpha) {
        const ctx = this.ctx;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
        ctx.globalAlpha = 1;
    }

    // Awareness ring indicator (HUD)
    drawAwarenessRing(x, y, radius, maxRadius, color) {
        const ctx = this.ctx;
        const progress = radius / maxRadius;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.4;
        // Background ring
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.stroke();
        // Progress arc
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(x, y, 10, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    // ---- UTILITIES ----
    hexToRGBA(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${alpha})`;
    }

    tileHash(x, y) {
        // Simple deterministic hash for procedural tile variation
        let h = x * 374761393 + y * 668265263;
        h = (h ^ (h >> 13)) * 1274126177;
        return Math.abs(h ^ (h >> 16)) & 0xFFFF;
    }

    // Lerp color (hex)
    lerpColor(a, b, t) {
        const ar = parseInt(a.slice(1, 3), 16);
        const ag = parseInt(a.slice(3, 5), 16);
        const ab = parseInt(a.slice(5, 7), 16);
        const br = parseInt(b.slice(1, 3), 16);
        const bg = parseInt(b.slice(3, 5), 16);
        const bb = parseInt(b.slice(5, 7), 16);
        const r = Math.round(ar + (br - ar) * t);
        const g = Math.round(ag + (bg - ag) * t);
        const blue = Math.round(ab + (bb - ab) * t);
        return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${blue.toString(16).padStart(2,'0')}`;
    }
}
