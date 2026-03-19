/**
 * Represents a standard enemy chicken in the game.
 * Handles movement, walking animation, and death behavior.
 */
class Chicken extends MovableObject {
    height = 60;
    width = 90;
    y = 360;
    speed = 0;
    isDead = false;
    movementInterval = null;
    animationInterval = null;

    IMAGES_WALKING = [
        'image/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'image/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'image/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];

    IMAGES_DEAD = [
        'image/3_enemies_chicken/chicken_normal/2_dead/dead.png',
    ];

    offset = { top: 0, bottom: 5, left: 10, right: 10 };

    /**
     * Creates a new chicken enemy at the given x position.
     *
     * @param {number} x - The horizontal start position.
     */
    constructor(x) {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = x;
        this.speed = 0.15 + Math.random() * 0.25;
    }

    /**
     * Starts movement and walking animation intervals.
     *
     * @returns {void}
     */
    animate() {
        if (this.movementInterval || this.animationInterval) return;

        this.movementInterval = setInterval(() => {
            if (!this.isDead) this.moveLeft();
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            if (!this.isDead) this.playAnimation(this.IMAGES_WALKING);
        }, 300);
    }

    /**
     * Stops all chicken intervals.
     *
     * @returns {void}
     */
    stopAnimate() {
        clearInterval(this.movementInterval);
        clearInterval(this.animationInterval);
        this.movementInterval = null;
        this.animationInterval = null;
    }

    /**
     * Kills the chicken and removes it after a short delay.
     *
     * @returns {void}
     */
    die() {
        if (this.isDead) return;
        this.isDead = true;
        this.speed = 0;
        this.stopAnimate();
        this.currentImage = 0;
        this.loadImage(this.IMAGES_DEAD[0]);
        this.playDeathSound();
        this.removeFromWorld();
    }

    /**
     * Plays the death sound safely.
     *
     * @returns {void}
     */
    playDeathSound() {
        if (!this.world || !this.world.soundManager) return;
        this.world.soundManager.play('chicken_dead');
    }

    /**
     * Removes the chicken from the enemy list after 1 second.
     *
     * @returns {void}
     */
    removeFromWorld() {
        setTimeout(() => {
            if (!this.world || !this.world.level) return;
            const index = this.world.level.enemies.indexOf(this);
            if (index > -1) {
                this.world.level.enemies.splice(index, 1);
            }
        }, 1000);
    }
}