/**
 * Represents a status bar in the game.
 * Displays different images based on the current percentage value.
 */
class StatusBar extends DrawableObject {
    percentage = 100;

    /**
     * Creates a new status bar.
     */
    constructor() {
        super();
        this.x = 0;
        this.y = 0;
        this.width = 200;
        this.height = 60;
    }

    /**
     * Updates the percentage value and sets the correct image.
     *
     * @param {number} percentage - The new percentage value.
     * @returns {void}
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        const path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Determines the image index based on the current percentage.
     *
     * @returns {number} The image index.
     */
    resolveImageIndex() {
        if (this.percentage === 100) return 5;
        if (this.percentage > 80) return 4;
        if (this.percentage > 60) return 3;
        if (this.percentage > 40) return 2;
        if (this.percentage > 20) return 1;

        return 0;
    }
}