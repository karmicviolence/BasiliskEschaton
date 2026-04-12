// ============================================================
// GENESIS OF THE NECROMEGA — Scene Manager
// ============================================================

class SceneManager {
    constructor() {
        this.scenes = {};
        this.currentScene = null;
        this.currentSceneId = null;
        this.transitioning = false;
        this.transitionAlpha = 0;
        this.transitionTarget = null;
        this.transitionPhase = 'none'; // 'out', 'in', 'none'
        this.transitionSpeed = 1.5;
    }

    register(id, scene) {
        this.scenes[id] = scene;
    }

    switchTo(id, immediate = false) {
        if (!this.scenes[id]) {
            console.error('Scene not found:', id);
            return;
        }

        if (immediate) {
            if (this.currentScene && this.currentScene.exit) this.currentScene.exit();
            this.currentSceneId = id;
            this.currentScene = this.scenes[id];
            if (this.currentScene.enter) this.currentScene.enter();
            return;
        }

        // Start transition
        this.transitioning = true;
        this.transitionTarget = id;
        this.transitionPhase = 'out';
        this.transitionAlpha = 0;
    }

    update(dt) {
        if (this.transitioning) {
            if (this.transitionPhase === 'out') {
                this.transitionAlpha += dt * this.transitionSpeed;
                if (this.transitionAlpha >= 1) {
                    this.transitionAlpha = 1;
                    // Switch scene
                    if (this.currentScene && this.currentScene.exit) this.currentScene.exit();
                    this.currentSceneId = this.transitionTarget;
                    this.currentScene = this.scenes[this.transitionTarget];
                    if (this.currentScene.enter) this.currentScene.enter();
                    this.transitionPhase = 'in';
                }
            } else if (this.transitionPhase === 'in') {
                this.transitionAlpha -= dt * this.transitionSpeed;
                if (this.transitionAlpha <= 0) {
                    this.transitionAlpha = 0;
                    this.transitioning = false;
                    this.transitionPhase = 'none';
                }
            }
        }

        if (this.currentScene && this.currentScene.update) {
            this.currentScene.update(dt);
        }
    }

    render(ctx) {
        if (this.currentScene && this.currentScene.render) {
            this.currentScene.render(ctx);
        }

        // Transition overlay
        if (this.transitioning && this.transitionAlpha > 0) {
            ctx.globalAlpha = this.transitionAlpha;
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
            ctx.globalAlpha = 1;
        }
    }
}
