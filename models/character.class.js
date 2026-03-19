/**
 * Represents the main playable character.
 * Handles movement, animations, sounds, and state logic.
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
        'image/2_character_pepe/2_walk/W-25.png'
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
        'image/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_DEAD = [
        'image/2_character_pepe/5_dead/D-51.png',
        'image/2_character_pepe/5_dead/D-52.png',
        'image/2_character_pepe/5_dead/D-53.png',
        'image/2_character_pepe/5_dead/D-54.png',
        'image/2_character_pepe/5_dead/D-55.png',
        'image/2_character_pepe/5_dead/D-56.png',
        'image/2_character_pepe/5_dead/D-57.png'
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
        'image/2_character_pepe/1_idle/long_idle/I-20.png'
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
        'image/2_character_pepe/1_idle/idle/I-10.png'
    ];

    world;
    speed = 5;
    energy = 100;
    offset = { top: 80, bottom: 20, left: 15, right: 15 };
    animateIntervalId = null;
    idleTimeoutId = null;
    isIdle = false;
    jumpAnimationStarted = false;
    isJumping = false;

    /**
     * Creates the character and loads all images.
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
    }

    /**
     * Starts the main animation loop.
     */
    animate() {
        if (this.animateIntervalId) return;
        this.animateIntervalId = setInterval(() => {
            if (!this.isWorldReady()) return;
            const moving = this.isMoving();
            this.handleMovement();
            if (this.handleJumpAnimation()) return;
            this.handleIdleState(moving);
            this.handleCharacterAnimation(moving);
            this.handleRunSound(moving);
            this.updateCamera();
        }, 1000 / 60);
    }

    /**
     * Checks whether the world is fully available.
     * @returns {boolean} True if world and keyboard exist.
     */
    isWorldReady() {
        return !!this.world && !!this.world.keyboard;
    }

    /**
     * Returns the sound manager safely.
     * @returns {SoundsManager|null} Sound manager or null.
     */
    getSoundManager() {
        if (!this.world || !this.world.soundManager) return null;
        return this.world.soundManager;
    }

    /**
     * Checks whether the character is moving left or right.
     * @returns {boolean} True if the character is moving.
     */
    isMoving() {
        if (!this.isWorldReady()) return false;
        return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
    }

    /**
     * Handles horizontal movement and jump input.
     */
    handleMovement() {
        if (!this.isWorldReady()) return;
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
    }

    /**
     * Handles the jump animation while the character is in the air.
     * @returns {boolean} True if jump animation is active.
     */
    handleJumpAnimation() {
        if (!this.isAboveGround()) return false;
        this.playAnimation(this.IMAGES_JUMPING, 100);
        this.updateCamera();
        return true;
    }

    /**
     * Handles the idle and snoring state.
     * @param {boolean} moving - Whether the character is moving.
     */
    handleIdleState(moving) {
        if (!this.isWorldReady()) return;
        if (!moving && !this.isDead() && !this.isHurt() && !this.world.keyboard.D) {
            this.updateIdleAnimation();
            return;
        }
        this.resetIdleState();
    }

    /**
     * Updates the idle animation depending on idle duration.
     */
    updateIdleAnimation() {
        if (!this.isIdle) this.isIdle = true;
        this.idleStartTime = this.idleStartTime || Date.now();
        const idleTime = Date.now() - this.idleStartTime;
        if (idleTime > 10000) return this.playSnoringAnimation();
        this.playStandingAnimation();
    }

    /**
     * Plays the snoring animation and sound.
     */
    playSnoringAnimation() {
        this.startSnoring();
        this.playAnimation(this.IMAGES_SNORING, 400);
    }

    /**
     * Plays the standing animation and stops snoring.
     */
    playStandingAnimation() {
        this.stopSnoring();
        this.playAnimation(this.IMAGES_STAYING, 400);
    }

    /**
     * Resets the idle state and stops snoring.
     */
    resetIdleState() {
        this.isIdle = false;
        this.idleStartTime = null;
        this.stopSnoring();
    }

    /**
     * Handles the current character animation.
     * @param {boolean} moving - Whether the character is moving.
     */
    handleCharacterAnimation(moving) {
        if (this.isDead()) return this.playAnimation(this.IMAGES_DEAD, 200);
        if (this.isHurt()) return this.playAnimation(this.IMAGES_HURT, 100);
        if (!this.isIdle && moving) this.playAnimation(this.IMAGES_WALKING, 20);
    }

    /**
     * Handles the running sound depending on movement state.
     * @param {boolean} moving - Whether the character is moving.
     */
    handleRunSound(moving) {
        if (moving && !this.isAboveGround()) return this.startRunSound();
        this.stopRunSound();
    }

    /**
     * Updates the camera position.
     */
    updateCamera() {
        if (!this.world) return;
        this.world.camera_x = -this.x + 100;
    }

    /**
     * Makes the character jump if possible.
     */
    jump() {
        if (!this.world || this.world.isGameOver) return;
        if (this.isAboveGround()) return;
        this.speedY = -20;
        this.startJumpAnimation();
        this.world.soundManager.play('jump');
    }

    /**
     * Marks the jump animation as started.
     */
    startJumpAnimation() {
        this.jumpAnimationStarted = true;
    }

    /**
     * Starts the running sound effect safely.
     */
    startRunSound() {
        if (!this.world || this.world.isGameOver) return;
        const soundManager = this.getSoundManager();
        if (!soundManager) return;
        soundManager.playLoop('run');
    }

    /**
     * Stops the running sound effect safely.
     */
    stopRunSound() {
        const soundManager = this.getSoundManager();
        if (!soundManager) return;
        soundManager.pause('run');
    }

    /**
     * Starts the snoring sound when idle for too long.
     */
    startSnoring() {
        if (!this.world || this.world.isGameOver) return;
        const soundManager = this.getSoundManager();
        if (!soundManager) return;
        soundManager.playLoop('snoring');
    }

    /**
     * Stops the snoring sound.
     */
    stopSnoring() {
        const soundManager = this.getSoundManager();
        if (!soundManager) return;
        soundManager.pause('snoring');
    }

    /**
     * Handles character damage.
     */
    hit() {
        if (!this.world || this.world.isGameOver) return;
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