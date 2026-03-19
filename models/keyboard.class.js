/**
 * Handles keyboard and mobile button input for the game.
 * Tracks which keys or buttons are currently pressed.
 */
class Keyboard {
    /**
     * Creates a keyboard input manager.
     */
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
     * Binds keyboard events to update key states.
     *
     * @returns {void}
     */
    bindKeypressEvents() {
        window.addEventListener('keydown', (e) => {
            this.setKeyState(e.keyCode, true);
        });

        window.addEventListener('keyup', (e) => {
            this.setKeyState(e.keyCode, false);
        });
    }

    /**
     * Updates a key state based on the given key code.
     *
     * @param {number} keyCode - The keyboard key code.
     * @param {boolean} state - The new key state.
     * @returns {void}
     */
    setKeyState(keyCode, state) {
        if (keyCode === 39) this.RIGHT = state;
        if (keyCode === 37) this.LEFT = state;
        if (keyCode === 40) this.DOWN = state;
        if (keyCode === 38) this.UP = state;
        if (keyCode === 32) this.SPACE = state;
        if (keyCode === 68) this.D = state;
    }

    /**
     * Binds mobile button events to update key states.
     *
     * @returns {void}
     */
    bindMobileBtnPressEvents() {
        const buttons = this.getMobileButtons();
        if (!buttons) {return;}
        this.bindButtonEvents(buttons.right, 'RIGHT');
        this.bindButtonEvents(buttons.left, 'LEFT');
        this.bindButtonEvents(buttons.up, 'UP');
        this.bindButtonEvents(buttons.throwBtn, 'D');
    }

    /**
     * Returns the mobile control button elements.
     *
     * @returns {?Object} The button collection or null.
     */
    getMobileButtons() {
        const right = document.getElementById('btn-right');
        const left = document.getElementById('btn-left');
        const up = document.getElementById('btn-up');
        const throwBtn = document.getElementById('btn-up-right');
        if (!right || !left || !up || !throwBtn) {
            return null;
        }
        return { right, left, up, throwBtn };
    }

    /**
     * Binds touch and mouse events to a mobile button.
     *
     * @param {HTMLElement} button - The button element.
     * @param {string} key - The key name to update.
     * @returns {void}
     */
    bindButtonEvents(button, key) {
        button.addEventListener('touchstart', (e) => this.handleTouchPress(e, key));
        button.addEventListener('touchend', () => this.setButtonState(key, false));
        button.addEventListener('mousedown', () => this.setButtonState(key, true));
        button.addEventListener('mouseup', () => this.setButtonState(key, false));
        button.addEventListener('mouseleave', () => this.setButtonState(key, false));
    }

    /**
     * Handles touch start events for mobile buttons.
     *
     * @param {Event} event - The touch event.
     * @param {string} key - The key name to update.
     * @returns {void}
     */
    handleTouchPress(event, key) {
        if (event.cancelable) {
            event.preventDefault();
        }

        this.setButtonState(key, true);
    }

    /**
     * Updates the state of a mobile control key.
     *
     * @param {string} key - The key name to update.
     * @param {boolean} state - The new key state.
     * @returns {void}
     */
    setButtonState(key, state) {
        this[key] = state;
    }

    /**
     * Resets all key states to false.
     *
     * @returns {void}
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