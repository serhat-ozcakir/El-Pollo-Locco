/**
 * Class: ThrowableObject
 * 
 * Represents throwable objects in the game, such as bottles.
 * Extends MovableObject and supports throwing, rotation animation,
 * and splash animation upon impact.
 */

class ThrowableObject extends MovableObject {
    IMAGES = [
        'image/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'image/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'image/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'image/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_SPLASH = [
        'image/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'image/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'image/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'image/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png'
    ];

    speedX = 6;
    gravity = 1;
    isThrown = false;
    isSplashing = false;
    markedForRemoval = false;

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 60;
        this.loadImage('image/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES);
        this.loadImages(this.IMAGES_SPLASH);
        this.currentImage = 0;
        this.animate();
    }

    /**
     * Animates the throwable object while in flight (rotation).
     */

    animate() {
        setInterval(() => {
            if (this.isThrown && !this.isSplashing) {
                this.playAnimation(this.IMAGES);
            }
        }, 1000 / 25);
    }

    /**
     * Throws the object, applying initial vertical speed and horizontal motion.
     */
    throw(direction = 1) {  // 1 = sağ, -1 = sol
        if (this.isThrown) return;
        this.isThrown = true;
        this.speedY = -17;
        this.speedX = Math.abs(this.speedX) * direction; // hız yönü

        setInterval(() => {
            this.y += this.speedY;
            this.speedY += this.gravity;
            this.x += this.speedX;
        }, 1000 / 60);
    }
    
    /**
     * Triggers the splash animation on impact and marks the object for removal.
     */
    splash() {
        if (this.isSplashing) return;
        this.isSplashing = true;
        this.speedX = 0;
        this.speedY = 0;
        let i = 0;
        const interval = setInterval(() => {
            if (i < this.IMAGES_SPLASH.length) {
                this.img = this.imageCache[this.IMAGES_SPLASH[i]];
                i++;
            } else {
                clearInterval(interval);
                this.markedForRemoval = true;
            }
        }, 1000 / 25);
    }

    /**
     * Plays an animation using the provided image array.
     * @param {string[]} images - Array of image paths for the animation.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        if (this.imageCache[images[i]]) {
            this.img = this.imageCache[images[i]];
            this.currentImage++;
        }
    }
}
