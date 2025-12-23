let canvas;
let world;
let keyboard = new Keyboard();
let gameStarted = false;

function init() {
    canvas = document.getElementById('canvas');
    showStartScreen();
}

function toggleFullScreen() {
    let element = document.documentElement;;

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


function startGame() {
    if (gameStarted) return;
    hideAllScreens();
    world = new World(canvas, keyboard);
    gameStarted = true;
}


function restartGame() {
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

window.addEventListener("keydown", (e) => {
    if(e.keyCode == 39) keyboard.RIGHT = true;
    if(e.keyCode == 37) keyboard.LEFT = true;
    if(e.keyCode == 40) keyboard.DOWN = true;
    if(e.keyCode == 38) keyboard.UP = true;
    if(e.keyCode == 32) keyboard.SPACE = true;
    if(e.keyCode == 68) keyboard.D = true;
});

window.addEventListener("keyup", (e) => {
    if(e.keyCode == 39) keyboard.RIGHT = false;
    if(e.keyCode == 37) keyboard.LEFT = false;
    if(e.keyCode == 40) keyboard.DOWN = false;
    if(e.keyCode == 38) keyboard.UP = false;
    if(e.keyCode == 32) keyboard.SPACE = false;
    if(e.keyCode == 68) keyboard.D = false;
});