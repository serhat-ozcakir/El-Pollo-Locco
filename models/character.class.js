/**
 * Represents the main playable character.
 * Handles movement, animations, sounds and state logic.
 */
class Character extends MovableObject {
    height = 280;
    groundY = 140;
    y = 80;

    IMAGES_WALKING = [
        'image/2_character_pepe/2_walk/W-21.png',
        'image/2_character_pepe/2_walk/W-22.png',
        'image/2_character_pepe/2_walk/W-23.png',
        'image/2_character_pepe/2_walk/W-24.png',
        'image/2_character_pepe/2_walk/W-25.png',
        'image/2_character_pepe/2_walk/W-25.png',
    ];

    IMAGES_JUMPING = [
        'image/2_character_pepe/3_jump/J-31.png',
        'image/2_character_pepe/3_jump/J-32.png',
        'image/2_character_pepe/3_jump/J-33.png',
        'image/2_character_pepe/3_jump/J-34.png',
        'image/2_character_pepe/3_jump/J-35.png',
        'image/2_character_pepe/3_jump/J-36.png',
        'image/2_character_pepe/3_jump/J-37.png',
        'image/2_character_pepe/3_jump/J-38.png',
        'image/2_character_pepe/3_jump/J-39.png',
    ];

    IMAGES_DEAD = [
        'image/2_character_pepe/5_dead/D-51.png',
        'image/2_character_pepe/5_dead/D-52.png',
        'image/2_character_pepe/5_dead/D-53.png',
        'image/2_character_pepe/5_dead/D-54.png',
        'image/2_character_pepe/5_dead/D-55.png',
        'image/2_character_pepe/5_dead/D-56.png',
        'image/2_character_pepe/5_dead/D-57.png',
    ];

    IMAGES_HURT = [
        'image/2_character_pepe/4_hurt/H-41.png',
        'image/2_character_pepe/4_hurt/H-42.png',
        'image/2_character_pepe/4_hurt/H-43.png'
    ];

    IMAGES_SNORING = [
        'image/2_character_pepe/1_idle/long_idle/I-11.png',
        'image/2_character_pepe/1_idle/long_idle/I-12.png',
        'image/2_character_pepe/1_idle/long_idle/I-13.png',
        'image/2_character_pepe/1_idle/long_idle/I-14.png',
        'image/2_character_pepe/1_idle/long_idle/I-15.png',
        'image/2_character_pepe/1_idle/long_idle/I-16.png',
        'image/2_character_pepe/1_idle/long_idle/I-17.png',
        'image/2_character_pepe/1_idle/long_idle/I-18.png',
        'image/2_character_pepe/1_idle/long_idle/I-19.png',
        'image/2_character_pepe/1_idle/long_idle/I-20.png',
    ];

    IMAGES_STAYING = [
        'image/2_character_pepe/1_idle/idle/I-1.png',
        'image/2_character_pepe/1_idle/idle/I-2.png',
        'image/2_character_pepe/1_idle/idle/I-3.png',
        'image/2_character_pepe/1_idle/idle/I-4.png',
        'image/2_character_pepe/1_idle/idle/I-5.png',
        'image/2_character_pepe/1_idle/idle/I-6.png',
        'image/2_character_pepe/1_idle/idle/I-7.png',
        'image/2_character_pepe/1_idle/idle/I-8.png',
        'image/2_character_pepe/1_idle/idle/I-9.png',
        'image/2_character_pepe/1_idle/idle/I-10.png',
    ];

    world;
    speed = 5;
    energy = 100;
    offset = { top: 80, bottom: 20, left: 15, right: 15 };
    animateIntervalId = null;
    idleTimeoutId = null;
    isIdle = false;
    jumpAnimationStarted = false; // Jump animasyonu flag
    isJumping = false;
    /**
     * Creates the character, loads images and starts animation loop.
     */
    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_SNORING);
        this.loadImages(this.IMAGES_STAYING);
        this.applyGravity();
        this.animate();
    }

    /**
     * Main animation loop.
     * Handles movement, animations, sounds and camera movement.
     */
    animate() {
        if (this.animateIntervalId) return;

        this.animateIntervalId = setInterval(() => {
            const moving = this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
            }
            if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
            }
            if (this.world.keyboard.UP && !this.isAboveGround()) {
                this.jump();
            }
            if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING, 100);
                this.world.camera_x = -this.x + 100;
                return;
            }
            if (!moving && !this.isDead() && !this.isHurt() && !this.world.keyboard.D) {
                if (!this.isIdle) this.isIdle = true;
                this.idleStartTime = this.idleStartTime || Date.now();
                const idleTime = Date.now() - this.idleStartTime;
                if (idleTime > 10000) {
                    this.startSnoring();
                    this.playAnimation(this.IMAGES_SNORING, 400);
                } else {
                    this.stopSnoring();
                    this.playAnimation(this.IMAGES_STAYING, 400);
                }
            } else {
                this.isIdle = false;
                this.idleStartTime = null;
                this.stopSnoring();
            }
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD, 200);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT, 100);
            } else if (!this.isIdle && moving) {
                this.playAnimation(this.IMAGES_WALKING, 20);
            }

            if (moving && !this.isAboveGround()) {
                this.startRunSound();
            } else {
                this.stopRunSound();
            }
            this.world.camera_x = -this.x + 100;

        }, 1000 / 60);
    }

    /**
     * Makes the character jump if possible.
     */
    jump() {
        if (this.world.isGameOver) return;
        if (!this.isAboveGround()) {
            this.speedY = -20;
            this.startJumpAnimation(); // jump animasyonu tetiklenir
            this.world.soundManager.play('jump');
        }
    }

 /**
     * Plays jump animation once per jump.
     */
startJumpAnimation() {
    this.jumpAnimationStarted = true;
}

  /**
     * Starts running sound effect.
     */
    startRunSound() {
        if (this.world.isGameOver) return;
        const runSound = this.world.soundManager.sounds.run;
        if (runSound.paused) {
            runSound.currentTime = 0;
            runSound.play();
        }
    }

    /**
     * Stops running sound effect.
     */
    stopRunSound() {
        const runSound = this.world.soundManager.sounds.run;
        if (!runSound.paused) {
            runSound.pause();
            runSound.currentTime = 0;
        }
    }
    
    /**
     * Starts snoring sound when idle too long.
     */
    startSnoring() {
        if (this.world.isGameOver) return;
        const snoreSound = this.world.soundManager.sounds.snoring;
        if (snoreSound.paused) {
            snoreSound.currentTime = 0;
            snoreSound.play();
        }
    }

    /**
     * Stops snoring sound.
     */
    stopSnoring() {
        const snoreSound = this.world.soundManager.sounds.snoring;
        if (!snoreSound.paused) {
            snoreSound.pause();
            snoreSound.currentTime = 0;
        }
    }

    /**
     * Handles character getting hit.
     */
    hit() {
        if (this.world.isGameOver) return;
        super.hit();
        this.world.soundManager.play('damage');
    }

    /**
     * Stops all animations and sounds.
     */
    stopAnimate() {
        if (this.animateIntervalId) {
            clearInterval(this.animateIntervalId);
            this.animateIntervalId = null;
        }
        if (this.idleTimeoutId) {
            clearTimeout(this.idleTimeoutId);
            this.idleTimeoutId = null;
        }
        this.stopSnoring();
        this.stopRunSound();
    }
}

