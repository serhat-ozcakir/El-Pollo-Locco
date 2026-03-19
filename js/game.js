let canvas;
let world;
let keyboard;
let gameStarted = false;
let soundManager;
let mobileControlsEnabled = false;

/**
 * Initializes the game and prepares the start screen.
 */
function init() {
    canvas = document.getElementById('canvas');
    soundManager = new SoundsManager();
    keyboard = new Keyboard();
    addEventListeners();
    updateMuteIcon();
    showStartScreen();
    document.querySelector('.top-right-icons').style.display = 'none';
}

/**
 * Adds all global event listeners.
 */
function addEventListeners() {
    addFullscreenEventListeners();
}

/**
 * Adds fullscreen change event listeners.
 */
function addFullscreenEventListeners() {
    document.addEventListener('fullscreenchange', updateFullscreenIcon);
    document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
    document.addEventListener('msfullscreenchange', updateFullscreenIcon);
}

/**
 * Toggles the mute state and updates the mute icon.
 */
function toggleMute() {
    soundManager.toggleMute();
    updateMuteIcon();
}

/**
 * Updates the mute icon based on the current sound state.
 */
function updateMuteIcon() {
    const icon = document.getElementById('mute-icon');
    if (soundManager.isMuted) {
        icon.classList.remove('bi-volume-up');
        icon.classList.add('bi-volume-mute');
        return;
    }

    icon.classList.remove('bi-volume-mute');
    icon.classList.add('bi-volume-up');
}

/**
 * Toggles fullscreen mode for the game wrapper.
 */
function toggleFullScreen() {
    const element = document.getElementById('game-wrapper');
    if (!document.fullscreenElement) {
        enterFullScreen(element);
        return;
    }

    exitFullScreen();
}

/**
 * Requests fullscreen mode with browser compatibility support.
 * @param {HTMLElement} element - The element to show in fullscreen.
 */
function enterFullScreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

/**
 * Exits fullscreen mode with browser compatibility support.
 */
function exitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

/**
 * Toggles the visibility of the mobile controls.
 */
function toggleControl() {
    const mobileControls = document.getElementById('mobile-controls');
    if (mobileControls.style.display === 'flex') {
        mobileControls.style.display = 'none';
        return;
    }

    mobileControls.style.display = 'flex';
}

/**
 * Updates the mobile controls based on the current game state.
 */
function updateMobileControls() {
    const mobileControls = document.getElementById('mobile-controls');
    if (gameStarted && !world?.isGameOver && mobileControlsEnabled) {
        mobileControls.style.display = 'flex';
        return;
    }

    mobileControls.style.display = 'none';
}

/**
 * Updates the fullscreen icon depending on the fullscreen state.
 */
function updateFullscreenIcon() {
    const fullscreenBtn = document.getElementById('fullscreen-icon');
    if (isFullscreenActive()) {
        fullscreenBtn.classList.remove('bi-fullscreen');
        fullscreenBtn.classList.add('bi-fullscreen-exit');
        return;
    }

    fullscreenBtn.classList.remove('bi-fullscreen-exit');
    fullscreenBtn.classList.add('bi-fullscreen');
}

/**
 * Checks whether fullscreen mode is currently active.
 * @returns {boolean} True if fullscreen is active.
 */
function isFullscreenActive() {
    return !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
    );
}

/**
 * Checks whether the game can be started safely.
 * @returns {boolean} True if all required objects exist.
 */
function canStartGame() {
    return !!canvas && !!keyboard && !!soundManager;
}

/**
 * Starts the game and initializes the world.
 */
function startGame() {
    document.querySelector('.top-right-icons').style.display = 'flex';
    muteSoundButtonDisplay();
    if (gameStarted) return;
    if (!canStartGame()) return;
    hideAllScreens();
    world = new World(canvas, keyboard);
    gameStarted = true;
    updateMobileControls();
    soundManager.play('game_start');
    soundManager.play('background_music');
}

/**
 * Restarts the current game session.
 */
function restartGame() {
    document.querySelector('.top-right-icons').style.display = 'flex';
    muteSoundButtonDisplay();
    soundManager.stopAll();
    hideAllScreens();
    resetWorldState();
    keyboard.reset();
    level1.reset();
    gameStarted = false;
    updateMobileControls();
    startGame();
}

/**
 * Resets the current world instance if it exists.
 */
function resetWorldState() {
    if (!world) return;
    world.stopGameLoop();
    world = null;
}

/**
 * Returns from the game to the main menu.
 */
function mainGame() {
    document.querySelector('.top-right-icons').style.display = 'none';
    muteSoundButtonDisplayHome();
    soundManager.stopAll();
    resetWorldState();
    clearCanvas();
    gameStarted = false;
    keyboard.reset();
    hideAllScreens();
    showStartScreen();
    updateMobileControls();
    resetLevel();
}

/**
 * Clears the canvas content.
 */
function clearCanvas() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Resets level1 if a reset function exists.
 */
function resetLevel() {
    if (level1 && typeof level1.reset === 'function') {
        level1.reset();
    }
}

/**
 * Shows the mute and fullscreen buttons.
 */
function muteSoundButtonDisplay() {
    document.getElementById('mute-icon').style.display = 'block';
    document.getElementById('fullscreen-icon').style.display = 'block';
}

/**
 * Hides the mute and fullscreen buttons.
 */
function muteSoundButtonDisplayHome() {
    document.getElementById('mute-icon').style.display = 'none';
    document.getElementById('fullscreen-icon').style.display = 'none';
}

/**
 * Shows the start screen and hides all end screens.
 */
function showStartScreen() {
    document.getElementById('start-screen').classList.remove('d-none');
    document.getElementById('win-screen').classList.add('d-none');
    document.getElementById('gameover-screen').classList.add('d-none');
}

/**
 * Hides all game-related screens.
 */
function hideAllScreens() {
    document.getElementById('start-screen').classList.add('d-none');
    document.getElementById('win-screen').classList.add('d-none');
    document.getElementById('gameover-screen').classList.add('d-none');
}