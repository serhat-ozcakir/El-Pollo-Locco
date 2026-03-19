/**
 * Represents a coin object in the game.
 * Displays an animated collectible coin.
 */
class Coins extends DrawableObject {
    offset = { top: 10, bottom: 20, left: 20, right: 20 };

    IMAGES = [
        'image/8_coin/coin_1.png',
        'image/8_coin/coin_2.png',
    ];

    /**
     * Creates a new animated coin with a random position.
     */
    constructor() {
        super();
        this.loadImage('image/8_coin/coin_1.png');
        this.loadImages(this.IMAGES);
        this.width = 100;
        this.height = 100;
        this.x = 100 + Math.random() * 900;
        this.y = 30 + Math.random() * 350;
        this.animate();
    }

    /**
     * Starts the coin animation loop.
     *
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 200);
    }

    /**
     * Plays the animation using the given image array.
     *
     * @param {string[]} images - The animation image array.
     * @returns {void}
     */
    playAnimation(images) {
        const i = this.currentImage % images.length;
        this.img = this.imageCache[images[i]];
        this.currentImage++;
    }
}