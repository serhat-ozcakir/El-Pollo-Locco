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

       bindMobileBtnPressEvents() {
        const right = document.getElementById('btn-right');
        const left = document.getElementById('btn-left');
        const up = document.getElementById('btn-up');
        const throwBtn = document.getElementById('btn-up-right');

        if (!right || !left || !up || !throwBtn) return;

        right.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.RIGHT = true;
        });
        right.addEventListener('touchend', () => this.RIGHT = false);

        left.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.LEFT = true;
        });
        left.addEventListener('touchend', () => this.LEFT = false);

        up.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.UP = true;
        });
        up.addEventListener('touchend', () => this.UP = false);

        throwBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.D = true;
        });
        throwBtn.addEventListener('touchend', () => this.D = false);
    }
    

    reset() {
        this.RIGHT = false;
        this.LEFT = false;
        this.UP = false;
        this.DOWN = false;
        this.SPACE = false;
        this.D = false;
    }
}
