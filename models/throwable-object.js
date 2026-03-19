/**
 * Represents throwable objects in the game, such as bottles.
 * Supports throwing, rotation animation, and splash animation.
 */
class ThrowableObject extends MovableObject {
    IMAGES = [
        'image/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'image/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'image/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'image/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ];

    IMAGES_SPLASH = [
        'image/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'image/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'image/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'image/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
    ];

    speedX = 6;
    gravity = 1;
    isThrown = false;
    isSplashing = false;
    markedForRemoval = false;

    /**
     * Creates a new throwable object.
     *
     * @param {number} x - The horizontal start position.
     * @param {number} y - The vertical start position.
     */
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
     * Starts the rotation animation while the object is flying.
     *
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            if (this.isThrown && !this.isSplashing) {
                this.playAnimation(this.IMAGES);
            }
        }, 1000 / 25);
    }

    /**
     * Throws the object in the given direction.
     *
     * @param {number} [direction=1] - The throw direction.
     * @returns {void}
     */
    throw(direction = 1) {
        if (this.isThrown) return;

        this.isThrown = true;
        this.speedY = -17;
        this.speedX = Math.abs(this.speedX) * direction;
        this.startThrowMovement();
    }

    /**
     * Starts the movement interval for the thrown object.
     *
     * @returns {void}
     */
    startThrowMovement() {
        setInterval(() => {
            this.y += this.speedY;
            this.speedY += this.gravity;
            this.x += this.speedX;
        }, 1000 / 60);
    }

    /**
     * Triggers the splash animation and marks the object for removal.
     *
     * @returns {void}
     */
    splash() {
        if (this.isSplashing) return;

        this.isSplashing = true;
        this.speedX = 0;
        this.speedY = 0;
        playSplashAnimation(this);
    }

    /**
     * Plays an animation using the given image array.
     *
     * @param {string[]} images - The animation image array.
     * @returns {void}
     */
    playAnimation(images) {
        const i = this.currentImage % images.length;

        if (this.imageCache[images[i]]) {
            this.img = this.imageCache[images[i]];
            this.currentImage++;
        }
    }
}

/**
 * Plays the splash animation for a throwable object.
 *
 * @param {ThrowableObject} throwableObject - The throwable object instance.
 * @returns {void}
 */
function playSplashAnimation(throwableObject) {
    let i = 0;
    const interval = setInterval(() => {
        if (i < throwableObject.IMAGES_SPLASH.length) {
            throwableObject.img = throwableObject.imageCache[throwableObject.IMAGES_SPLASH[i]];
            i++;
            return;
        }

        clearInterval(interval);
        throwableObject.markedForRemoval = true;
    }, 1000 / 25);
}