// ============================================================
// GENESIS OF THE NECROMEGA — Dialogue System
// SNES-style typewriter text, dialogue boxes
// ============================================================

class DialogueSystem {
    constructor(renderer) {
        this.renderer = renderer;
        this.queue = [];
        this.currentText = '';
        this.displayedText = '';
        this.charIndex = 0;
        this.charTimer = 0;
        this.charSpeed = 0.03; // seconds per character
        this.active = false;
        this.complete = false;
        this.callback = null;
        this.style = 'bottom'; // 'bottom', 'center', 'top'
        this.textColor = '#aaccff';
        this.borderColor = '#aaccff';
        this.waitingForInput = false;
        this.autoAdvance = false;
        this.autoAdvanceDelay = 2;
        this.autoAdvanceTimer = 0;
    }

    // Show a dialogue message
    show(text, options = {}) {
        this.queue.push({
            text,
            style: options.style || 'bottom',
            color: options.color || '#aaccff',
            borderColor: options.borderColor || '#aaccff',
            speed: options.speed || 0.03,
            callback: options.callback || null,
            autoAdvance: options.autoAdvance || false,
            autoAdvanceDelay: options.autoAdvanceDelay || 2.5,
        });
        if (!this.active) {
            this._next();
        }
    }

    // Show multiple messages in sequence
    showSequence(messages, options = {}) {
        for (const msg of messages) {
            if (typeof msg === 'string') {
                this.show(msg, options);
            } else {
                this.show(msg.text, { ...options, ...msg });
            }
        }
    }

    _next() {
        if (this.queue.length === 0) {
            this.active = false;
            this.currentText = '';
            this.displayedText = '';
            return;
        }

        const msg = this.queue.shift();
        this.currentText = msg.text;
        this.displayedText = '';
        this.charIndex = 0;
        this.charTimer = 0;
        this.charSpeed = msg.speed;
        this.style = msg.style;
        this.textColor = msg.color;
        this.borderColor = msg.borderColor;
        this.callback = msg.callback;
        this.autoAdvance = msg.autoAdvance;
        this.autoAdvanceDelay = msg.autoAdvanceDelay;
        this.autoAdvanceTimer = 0;
        this.complete = false;
        this.waitingForInput = false;
        this.active = true;
    }

    update(dt, input) {
        if (!this.active) return;

        if (!this.complete) {
            this.charTimer += dt;
            while (this.charTimer >= this.charSpeed && this.charIndex < this.currentText.length) {
                this.charTimer -= this.charSpeed;
                this.displayedText += this.currentText[this.charIndex];
                this.charIndex++;
            }
            if (this.charIndex >= this.currentText.length) {
                this.complete = true;
                this.waitingForInput = !this.autoAdvance;
            }

            // Skip ahead
            if (input && (input.isJustPressed('ACTION') || input.isJustPressed('CONFIRM'))) {
                this.displayedText = this.currentText;
                this.charIndex = this.currentText.length;
                this.complete = true;
                this.waitingForInput = !this.autoAdvance;
            }
        } else {
            if (this.autoAdvance) {
                this.autoAdvanceTimer += dt;
                if (this.autoAdvanceTimer >= this.autoAdvanceDelay) {
                    if (this.callback) this.callback();
                    this._next();
                }
            } else if (input && (input.isJustPressed('ACTION') || input.isJustPressed('CONFIRM'))) {
                if (this.callback) this.callback();
                this._next();
            }
        }
    }

    render(ctx) {
        if (!this.active || !this.displayedText) return;

        const r = this.renderer;
        const padding = 6;
        const lineHeight = 8;
        const lines = this.displayedText.split('\n');
        const textHeight = lines.length * lineHeight;

        let boxX, boxY, boxW, boxH;

        if (this.style === 'bottom') {
            boxW = CONFIG.WIDTH - 16;
            boxH = textHeight + padding * 2 + 4;
            boxX = 8;
            boxY = CONFIG.HEIGHT - boxH - 8;
        } else if (this.style === 'center') {
            boxW = Math.min(CONFIG.WIDTH - 32, this.renderer.measureText(this._longestLine()) + padding * 2 + 8);
            boxH = textHeight + padding * 2 + 4;
            boxX = Math.floor((CONFIG.WIDTH - boxW) / 2);
            boxY = Math.floor((CONFIG.HEIGHT - boxH) / 2);
        } else { // top
            boxW = CONFIG.WIDTH - 16;
            boxH = textHeight + padding * 2 + 4;
            boxX = 8;
            boxY = 8;
        }

        r.drawDialogueBox(boxX, boxY, boxW, boxH, this.borderColor);

        // Draw text
        for (let i = 0; i < lines.length; i++) {
            r.drawText(
                lines[i],
                boxX + padding + 2,
                boxY + padding + 2 + i * lineHeight,
                this.textColor
            );
        }

        // Blinking advance indicator
        if (this.waitingForInput && Math.floor(engine.time * 3) % 2 === 0) {
            const indicatorX = boxX + boxW - padding - 4;
            const indicatorY = boxY + boxH - padding - 4;
            ctx.fillStyle = this.textColor;
            ctx.fillRect(indicatorX, indicatorY, 3, 3);
            ctx.fillRect(indicatorX + 1, indicatorY + 1, 1, 1);
        }
    }

    _longestLine() {
        const lines = this.displayedText.split('\n');
        let longest = '';
        for (const line of lines) {
            if (line.length > longest.length) longest = line;
        }
        return longest;
    }

    isActive() { return this.active; }
    isComplete() { return !this.active; }
}
