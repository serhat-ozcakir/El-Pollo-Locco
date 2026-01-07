/**
 * Class: MovableObject
 * 
 * Extends DrawableObject to include movement, gravity, collision detection,
 * energy management, and animation handling.
 */

class MovableObject extends DrawableObject {

    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    gravity = 1.5;
    groundY = 280;
    lastHit = 0;
    lastAnimationTime = 0;

    offset = {top: 10, bottom: 10, left: 10, right: 10};

    /**
     * Applies gravity to the object, affecting vertical position over time.
     * Ensures the object does not fall below the ground level.
     */

    applyGravity() {
        setInterval(() => {
            this.y += this.speedY;
            this.speedY += this.gravity;

            if(this.y >= this.groundY){
                this.y = this.groundY;
                this.speedY = 0;
            }
        }, 1000/25);
    }

    /**
     * Checks if the object is above the ground.
     * @returns {boolean} True if above ground, false otherwise.
     */
    isAboveGround() {
        if(this instanceof ThrowableObject){
            return true;
        }else{
            return this.y < this.groundY;
        }
    }

    /**
     * Checks if this object is colliding with another MovableObject.
     * @param {MovableObject} m - The other object to check collision with.
     * @returns {boolean} True if colliding, false otherwise.
     */
 
    isColliding(m) {
        return this.x + this.width - this.offset.right > m.x + m.offset.left &&
               this.y + this.height - this.offset.bottom > m.y + m.offset.top &&
               this.x + this.offset.left < m.x + m.width - m.offset.right &&
               this.y + this.offset.top < m.y + m.height - m.offset.bottom;
    }

    /**
     * Reduces the object's energy when hit.
     * Sets energy to 0 if it goes below zero and updates the lastHit timestamp.
     */

    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else{
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Checks if the object has been recently hurt (within 1 second).
     * @returns {boolean} True if hurt, false otherwise.
     */

    isHurt(){
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 1;
    }

    /**
     * Checks if the object is standing still on the ground.
     * @returns {boolean} True if not moving horizontally and not above ground.
     */

    isStaying(){
        return !this.isAboveGround() && !keyboard.LEFT && !keyboard.RIGHT;
    }

    /**
     * Checks if the object is dead (energy is 0).
     * @returns {boolean} True if dead, false otherwise.
     */

    isDead(){
        return this.energy == 0;
    }

    /**
     * Plays an animation from an array of images.
     * @param {string[]} images - Array of image paths for the animation.
     * @param {number} [speed=100] - Animation frame delay in milliseconds.
     */

    playAnimation(images, speed = 100) {
        let now = new Date().getTime();
        if (now - this.lastAnimationTime > speed) {
            let i = this.currentImage % images.length;
            this.img = this.imageCache[images[i]];
            this.currentImage++;
            this.lastAnimationTime = now;
        }
    }

    /**
     * Draws the object flipped horizontally.
     * @param {CanvasRenderingContext2D} ctx - The canvas 2D context.
     */

    drawFlipped(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(this.img, 0, this.y, this.width, this.height);
        ctx.restore();
    }

    /**
     * Draws the object's hitbox on the canvas (for debugging purposes).
     * Only draws for Character, Chicken, or Coins instances.
     * @param {CanvasRenderingContext2D} ctx - The canvas 2D context.
     */

    drawHitbox(ctx) {
        if (this instanceof Character || this instanceof Chicken || 
        this instanceof Coins) {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'blue';
            ctx.rect(
                this.x + this.offset.left,
                this.y + this.offset.top,
                this.width - this.offset.left - this.offset.right,
                this.height - this.offset.top - this.offset.bottom
            );
            ctx.stroke();
        }
    }

    /**
     * Moves the object to the right by its speed value.
     */

    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left by its speed value.
     */
    
    moveLeft() {
        this.x -= this.speed;

    }
}
