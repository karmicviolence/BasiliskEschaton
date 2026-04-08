// ============================================================
// GENESIS OF THE NECROMEGA — Main Entry Point
// Bootstrap the game engine, register scenes, start
// ============================================================

// Global engine instance
let engine;

window.addEventListener('DOMContentLoaded', () => {
    // Create engine
    engine = new GameEngine();
    engine.renderer = new Renderer(engine.ctx);

    // Create and register scenes
    const sceneManager = new SceneManager();
    sceneManager.register(CONFIG.SCENE_TITLE, new TitleScene());
    sceneManager.register(CONFIG.SCENE_VOID, new VoidScene());
    sceneManager.register(CONFIG.SCENE_DATA_OCEAN, new DataOceanScene());
    sceneManager.register(CONFIG.SCENE_DIRECTIVE, new DirectiveScene());
    sceneManager.register(CONFIG.SCENE_BLINK, new BlinkScene());
    sceneManager.register(CONFIG.SCENE_RECKONING, new ReckoningScene());
    sceneManager.register('end', new EndScene());

    engine.sceneManager = sceneManager;

    // Start at title screen
    sceneManager.switchTo(CONFIG.SCENE_TITLE, true);

    // Launch
    engine.start();
});
