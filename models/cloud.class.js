/**
 * Represents a cloud in the game background.
 * Clouds move continuously to the left.
 */
class Clouds extends MovableObject {
    y = 50;
    width = 500;
    height = 150;

    /**
     * Creates a cloud instance with a random x position.
     */
    constructor() {
        super();
        this.loadImage('image/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 500;
    }

    /**
     * Starts the cloud movement animation.
     *
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }
}