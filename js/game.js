let canvas;
let world;
let keyboard;
let gameStarted = false;
let soundManager;
let mobileControlsEnabled = false;

/**
 * Initializes the game by setting up canvas, sound manager, and mute icon.
 * Also shows the start screen.
 */
function init() {
    canvas = document.getElementById('canvas');
    soundManager = new SoundsManager();
    updateMuteIcon();
    showStartScreen();
    document.querySelector('.top-right-icons').style.display = 'none';
}

window.addEventListener('DOMContentLoaded', () => {
    keyboard = new Keyboard();
});

/**
 * Toggles the mute state of the game sounds and updates the mute icon.
 */
function toggleMute() {
    soundManager.toggleMute();
    updateMuteIcon();
}

/**
 * Updates the mute icon based on the current mute state.
 * If muted, shows "bi-volume-mute"; otherwise shows "bi-volume-up".
 */
function updateMuteIcon() {
    const icon = document.getElementById('mute-icon');
    if (soundManager.isMuted) {
        icon.classList.remove('bi-volume-up');
        icon.classList.add('bi-volume-mute');
    } else {
        icon.classList.remove('bi-volume-mute');
        icon.classList.add('bi-volume-up');
    }
}


/**
 * Toggles fullscreen mode for the game.
 * Uses browser-specific prefixes for compatibility.
 */

function toggleFullScreen() {
   // let element = document.documentElement;
    let element = document.getElementById('game-wrapper');
    if (!document.fullscreenElement) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}


function toggleControl() {
    mobileControlsEnabled = !mobileControlsEnabled;
    updateMobileControls();
}


/**
 * Updates the visibility of mobile control buttons based on the current game state.
 *
 * - Shows the mobile controls (`display: flex`) when the game has started and is not over.
 * - Hides the mobile controls (`display: none`) when the game hasn't started or the game is over.
 *
 * This function should be called whenever the game state changes, such as:
 *   - When starting the game
 *   - When restarting the game
 *   - When returning to the main menu
 */

function updateMobileControls() {
    const mobileControls = document.getElementById('mobile-controls');
    if (gameStarted && !world?.isGameOver && mobileControlsEnabled) {
        mobileControls.style.display = 'flex';
    } else {
        mobileControls.style.display = 'none';
    }
}


// Event listeners for fullscreen changes
document.addEventListener('fullscreenchange', updateFullscreenIcon);
document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
document.addEventListener('msfullscreenchange', updateFullscreenIcon);

/**
 * Updates the fullscreen icon based on whether the game is in fullscreen mode.
 * Shows "fullscreen-exit" if in fullscreen, "fullscreen" otherwise.
 */
function updateFullscreenIcon() {
    const fullscreenBtn = document.getElementById('fullscreen-icon');
    if (document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
        fullscreenBtn.classList.remove('bi-fullscreen');
        fullscreenBtn.classList.add('bi-fullscreen-exit');
    } else {
        fullscreenBtn.classList.remove('bi-fullscreen-exit');
        fullscreenBtn.classList.add('bi-fullscreen');
    }
}   

/**
 * Starts the game.
 * - Displays mute and fullscreen icons.
 * - Prevents restarting if the game is already started.
 * - Hides all screens and initializes the game world.
 * - Plays start sound and background music.
 */
function startGame() {
    document.querySelector('.top-right-icons').style.display = 'flex';
    muteSoundButtonDisplay();
    if (gameStarted) return;
    hideAllScreens();
    world = new World(canvas, keyboard,soundManager);
    gameStarted = true;
    updateMobileControls();
    soundManager.play('game_start');
    soundManager.play('background_music');
}

/**
 * Restarts the game.
 * - Displays mute and fullscreen icons.
 * - Stops all sounds.
 * - Hides all screens.
 * - Stops the current game world loop if running.
 * - Resets keyboard and level1.
 * - Starts the game again.
 */
function restartGame() {
      document.querySelector('.top-right-icons').style.display = 'flex';
   muteSoundButtonDisplay()
    soundManager.stopAll();
    hideAllScreens();
    if (world) {
        world.stopGameLoop();
        world = null;
    }
    keyboard.reset();
    level1.reset();
    gameStarted = false;
    updateMobileControls();
    startGame();
}

/**
 * Returns to the main menu.
 * - Hides mute and fullscreen icons.
 * - Stops all sounds.
 * - Stops the game world loop if running.
 * - Clears the canvas.
 * - Resets keyboard and level1.
 * - Shows the start screen.
 */
function mainGame() {
     document.querySelector('.top-right-icons').style.display = 'none';
    muteSoundButtonDisplayHome();
    soundManager.stopAll();
    if (world) {
        world.stopGameLoop();
        world = null;
    }
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameStarted = false;
    keyboard.reset();
    hideAllScreens();
    showStartScreen();
    updateMobileControls();
    if (level1 && typeof level1.reset === "function") {
        level1.reset();
    }
}

/**
 * Displays mute and fullscreen icons.
 */
function muteSoundButtonDisplay() {
    document.getElementById('mute-icon').style.display = 'block';
    document.getElementById('fullscreen-icon').style.display = 'block';

}

/**
 * Hides mute and fullscreen icons.
 */
function muteSoundButtonDisplayHome() {
    document.getElementById('mute-icon').style.display = 'none';
    document.getElementById('fullscreen-icon').style.display = 'none';

}

function toggleControl() {
    const mobileControls = document.getElementById('mobile-controls');
    const controlBtn = document.getElementById('control-btn');

    if (mobileControls.style.display === 'flex') {
        mobileControls.style.display = 'none';
    } else {
        mobileControls.style.display = 'flex';
    }
}


/**
 * Shows the start screen and hides win/game over screens.
 */
function showStartScreen() {
    document.getElementById('start-screen').classList.remove('d-none');
    document.getElementById('win-screen').classList.add('d-none');
    document.getElementById('gameover-screen').classList.add('d-none');
}

/**
 * Hides all game screens (start, win, game over).
 */
function hideAllScreens() {
    document.getElementById('start-screen').classList.add('d-none');
    document.getElementById('win-screen').classList.add('d-none');
    document.getElementById('gameover-screen').classList.add('d-none');
}


