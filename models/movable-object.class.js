/**
 * Extends DrawableObject with movement, gravity, collision detection,
 * energy management, and animation handling.
 */
class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    gravity = 1.8;
    groundY = 280;
    lastHit = 0;
    lastAnimationTime = 0;

    offset = { top: 10, bottom: 10, left: 10, right: 10 };

    /**
     * Applies gravity to the object.
     *
     * @returns {void}
     */
    applyGravity() {
        setInterval(() => {
            this.updateVerticalPosition();
            this.limitToGround();
        }, 1000 / 25);
    }

    /**
     * Updates the vertical movement values.
     *
     * @returns {void}
     */
    updateVerticalPosition() {
        this.y += this.speedY;
        this.speedY += this.gravity;
    }

    /**
     * Prevents the object from falling below the ground.
     *
     * @returns {void}
     */
    limitToGround() {
        if (this.y < this.groundY) {
            return;
        }

        this.y = this.groundY;
        this.speedY = 0;
    }

    /**
     * Checks if the object is above the ground.
     *
     * @returns {boolean} True if above ground.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        }

        return this.y < this.groundY;
    }

    /**
     * Checks if this object collides with another object.
     *
     * @param {MovableObject} movableObject - The other object.
     * @returns {boolean} True if both objects collide.
     */
    isColliding(movableObject) {
        return this.x + this.width - this.offset.right > movableObject.x + movableObject.offset.left &&
            this.y + this.height - this.offset.bottom > movableObject.y + movableObject.offset.top &&
            this.x + this.offset.left < movableObject.x + movableObject.width - movableObject.offset.right &&
            this.y + this.offset.top < movableObject.y + movableObject.height - movableObject.offset.bottom;
    }

    /**
     * Reduces the object's energy after a hit.
     *
     * @returns {void}
     */
    hit() {
        this.energy -= 20;

        if (this.energy < 0) {
            this.energy = 0;
            return;
        }

        this.lastHit = new Date().getTime();
    }

    /**
     * Checks if the object was hurt recently.
     *
     * @returns {boolean} True if hurt within 400 ms.
     */
    isHurt() {
        return new Date().getTime() - this.lastHit < 400;
    }

    /**
     * Checks if the object is standing still on the ground.
     *
     * @returns {boolean} True if the object is staying.
     */
    isStaying() {
        return !this.isAboveGround() && !keyboard.LEFT && !keyboard.RIGHT;
    }

    /**
     * Checks if the object is dead.
     *
     * @returns {boolean} True if energy is 0.
     */
    isDead() {
        return this.energy === 0;
    }

    /**
     * Plays an animation from an image array.
     *
     * @param {string[]} images - The image array for the animation.
     * @param {number} [speed=100] - The animation delay in milliseconds.
     * @returns {void}
     */
    playAnimation(images, speed = 100) {
        const now = new Date().getTime();

        if (now - this.lastAnimationTime <= speed) {
            return;
        }

        this.updateAnimationFrame(images, now);
    }

    /**
     * Updates the current animation frame.
     *
     * @param {string[]} images - The image array for the animation.
     * @param {number} now - The current timestamp.
     * @returns {void}
     */
    updateAnimationFrame(images, now) {
        const i = this.currentImage % images.length;
        this.img = this.imageCache[images[i]];
        this.currentImage++;
        this.lastAnimationTime = now;
    }

    /**
     * Draws the object flipped horizontally.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas 2D context.
     * @returns {void}
     */
    drawFlipped(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(this.img, 0, this.y, this.width, this.height);
        ctx.restore();
    }

    /**
     * Draws the object's hitbox for debugging.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas 2D context.
     * @returns {void}
     */
    drawHitbox(ctx) {
        if (!this.shouldDrawHitbox()) {
            return;
        }

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'blue';
        this.drawHitboxRect(ctx);
        ctx.stroke();
    }

    /**
     * Checks if the hitbox should be drawn.
     *
     * @returns {boolean} True if hitbox drawing is allowed.
     */
    shouldDrawHitbox() {
        return this instanceof Character ||
            this instanceof Chicken ||
            this instanceof Coins;
    }

    /**
     * Draws the hitbox rectangle on the canvas.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas 2D context.
     * @returns {void}
     */
    drawHitboxRect(ctx) {
        ctx.rect(
            this.x + this.offset.left,
            this.y + this.offset.top,
            this.width - this.offset.left - this.offset.right,
            this.height - this.offset.top - this.offset.bottom
        );
    }

    /**
     * Moves the object to the right.
     *
     * @returns {void}
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left.
     *
     * @returns {void}
     */
    moveLeft() {
        this.x -= this.speed;
    }
}