/**
 * Class: DrawableObject
 * 
 * Base class for drawable objects in the game.
 * Provides basic properties and methods for position, size, image handling, and rendering.
 */

class DrawableObject {
    x = 0;
    y = 0;
    width = 100;
    height = 100;
    img;
    imageCache = {};
    currentImage = 0;

      /**
     * Loads a single image and sets it as the current image.
     * @param {string} path - Path to the image file.
     */

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

      /**
     * Loads multiple images into the image cache.
     * Useful for animations.
     * @param {string[]} arr - Array of image paths.
     */

    loadImages(arr) {
        arr.forEach(path => {
            const img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

       /**
     * Draws the object on the given canvas context.
     * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context.
     */

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}
