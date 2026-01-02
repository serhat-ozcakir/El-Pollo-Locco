/**
 * Class: smallChicken
 * 
 * Represents a small enemy chicken in the game.
 * Extends MovableObject with walking and death animations.
 */

class smallChicken extends MovableObject {
    height = 60;
    width = 40; 
    y = 351;
    energy = 1;
    isDead = false;

    IMAGES_WALKING = [
        'image/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'image/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'image/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'image/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    offset = { top: 5, bottom: 5, left: 10, right: 10 };

    constructor(x) {
        super();
        this.loadImage('image/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 500 + Math.random() * 1500;
        this.speed = 0.15 + Math.random() * 0.3;
        this.animate();
    }

    /**
     * Starts walking movement and animation intervals.
     */
    animate(){
        // Hareket interval'i
        this.movementInterval = setInterval(() => {
            if(!this.isDead) this.moveLeft();
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            if(!this.isDead) this.playAnimation(this.IMAGES_WALKING);
        }, 300);
    }

    /**
     * Kills the small chicken.
     * Stops movement, plays death animation and sound,
     * and removes it from the world after a short delay.
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