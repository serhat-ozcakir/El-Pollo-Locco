let canvas;
let world;
let keyboard;
let gameStarted = false;
let soundManager;

function init() {
    canvas = document.getElementById('canvas');
    soundManager = new SoundsManager();
    updateMuteIcon();
    showStartScreen();
}

window.addEventListener('DOMContentLoaded', () => {
    keyboard = new Keyboard();
});

function toggleMute() {
    soundManager.toggleMute();
    updateMuteIcon();
}

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

document.addEventListener('fullscreenchange', updateFullscreenIcon);
document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
document.addEventListener('msfullscreenchange', updateFullscreenIcon);

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


function startGame() {
    if (gameStarted) return;
    hideAllScreens();
    world = new World(canvas, keyboard,soundManager);
    gameStarted = true;
    soundManager.play('game_start');
    soundManager.play('background_music');
}


function restartGame() {
    soundManager.stopAll();
    hideAllScreens();
    if (world) {
        world.stopGameLoop();
        world = null;
    }
    keyboard.reset();
    level1.reset();
    gameStarted = false;
    startGame();
}

function mainGame() {
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
    if (level1 && typeof level1.reset === "function") {
        level1.reset();
    }
}

function showStartScreen() {
    document.getElementById('start-screen').classList.remove('d-none');
    document.getElementById('win-screen').classList.add('d-none');
    document.getElementById('gameover-screen').classList.add('d-none');
}

function hideAllScreens() {
    document.getElementById('start-screen').classList.add('d-none');
    document.getElementById('win-screen').classList.add('d-none');
    document.getElementById('gameover-screen').classList.add('d-none');
}

