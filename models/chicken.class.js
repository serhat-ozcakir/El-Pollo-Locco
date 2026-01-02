/**
 * Represents a standard enemy chicken in the game.
 * Handles movement, walking animation, and death behavior.
 * Inherits from MovableObject.
 */

class Chicken extends MovableObject {
    height = 60;
    width = 90;
    y = 360;
    speed = 0;
    isDead = false;

    IMAGES_WALKING = [
        'image/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'image/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'image/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];
    
    IMAGES_DEAD = [
        'image/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    offset = { top: 0, bottom: 5, left: 10, right: 10 };

    constructor(x) {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = x;
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
    }

    /**
     * Animates the chicken by moving it left and updating walking frames.
     * Stops animation if the chicken is dead.
     */
    animate() {
        this.movementInterval = setInterval(() => {
            if(!this.isDead) this.moveLeft();
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            if(!this.isDead) this.playAnimation(this.IMAGES_WALKING);
        }, 300);
    }
    
    /**
     * Kills the chicken: stops movement and animation,
     * plays death animation and sound, and removes it from the world after 1 second.
     */

    die() {
        if (this.isDead) return;
        this.isDead = true;
        this.speed = 0;
        clearInterval(this.movementInterval);
        clearInterval(this.animationInterval);
        this.currentImage = 0;
        this.loadImage(this.IMAGES_DEAD[0]);
        this.world.soundManager.play('chicken_dead');
        setTimeout(() => {
            const index = this.world.level.enemies.indexOf(this);
            if(index > -1) this.world.level.enemies.splice(index, 1);
        }, 1000);
    }

}
