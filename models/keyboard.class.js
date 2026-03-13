/**
 * Class: Keyboard
 * 
 * Handles keyboard and mobile button input for the game.
 * Tracks which keys or buttons are currently pressed.
 */

class Keyboard {
    constructor() {
        this.RIGHT = false;
        this.LEFT = false;
        this.UP = false;
        this.DOWN = false;
        this.SPACE = false;
        this.D = false;
        this.bindKeypressEvents();
        this.bindMobileBtnPressEvents();
    }

    /**
     * Binds keyboard events (keydown and keyup) to update key states.
     */
    bindKeypressEvents() {
        window.addEventListener("keydown", (e) => {
            if (e.keyCode == 39) this.RIGHT = true;
            if (e.keyCode == 37) this.LEFT = true;
            if (e.keyCode == 40) this.DOWN = true;
            if (e.keyCode == 38) this.UP = true;
            if (e.keyCode == 32) this.SPACE = true;
            if (e.keyCode == 68) this.D = true;
        });

        window.addEventListener("keyup", (e) => {
            if (e.keyCode == 39) this.RIGHT = false;
            if (e.keyCode == 37) this.LEFT = false;
            if (e.keyCode == 40) this.DOWN = false;
            if (e.keyCode == 38) this.UP = false;
            if (e.keyCode == 32) this.SPACE = false;
            if (e.keyCode == 68) this.D = false;
        });
    }

    /**
     * Binds touch events for mobile buttons to update key states.
     * Expects buttons with IDs: 'btn-right', 'btn-left', 'btn-up', 'btn-up-right'.
     */
bindMobileBtnPressEvents() {
    const right = document.getElementById('btn-right');
    const left = document.getElementById('btn-left');
    const up = document.getElementById('btn-up');
    const throwBtn = document.getElementById('btn-up-right');

    if (!right || !left || !up || !throwBtn) return;

    const press = (key) => {
        this[key] = true;
    };

    const release = (key) => {
        this[key] = false;
    };

    // RIGHT
    right.addEventListener('touchstart', (e) => {
        if (e.cancelable) e.preventDefault();
        press('RIGHT');
    });
    right.addEventListener('touchend', () => release('RIGHT'));
    right.addEventListener('mousedown', () => press('RIGHT'));
    right.addEventListener('mouseup', () => release('RIGHT'));
    right.addEventListener('mouseleave', () => release('RIGHT'));

    // LEFT
    left.addEventListener('touchstart', (e) => {
        if (e.cancelable) e.preventDefault();
        press('LEFT');
    });
    left.addEventListener('touchend', () => release('LEFT'));
    left.addEventListener('mousedown', () => press('LEFT'));
    left.addEventListener('mouseup', () => release('LEFT'));
    left.addEventListener('mouseleave', () => release('LEFT'));

    // UP
    up.addEventListener('touchstart', (e) => {
        if (e.cancelable) e.preventDefault();
        press('UP');
    });
    up.addEventListener('touchend', () => release('UP'));
    up.addEventListener('mousedown', () => press('UP'));
    up.addEventListener('mouseup', () => release('UP'));
    up.addEventListener('mouseleave', () => release('UP'));

    // THROW (D)
    throwBtn.addEventListener('touchstart', (e) => {
        if (e.cancelable) e.preventDefault();
        press('D');
    });
    throwBtn.addEventListener('touchend', () => release('D'));
    throwBtn.addEventListener('mousedown', () => press('D'));
    throwBtn.addEventListener('mouseup', () => release('D'));
    throwBtn.addEventListener('mouseleave', () => release('D'));
}

    
    /**
     * Resets all key states to false.
     */
    reset() {
        this.RIGHT = false;
        this.LEFT = false;
        this.UP = false;
        this.DOWN = false;
        this.SPACE = false;
        this.D = false;
    }
}
