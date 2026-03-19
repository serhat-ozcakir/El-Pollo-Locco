/**
 * Represents the final boss enemy in the game.
 */
class Endboss extends MovableObject {
    height = 400;
    width = 220;
    y = 55;
    energy = 100;
    maxEnergy = 100;
    isDeadAnimationPlayed = false;
    speed = 47;
    normalSpeed = 47;
    rageSpeed = 105;
    alertTime = 0;
    attackDistance = 40;
    hurtDuration = 500;
    state = 'IDLE';
    hasSeenCharacter = false;
    animateIntervalId = null;
    lastHit = 0;
    isRageAttacking = false;
    rageAttackQueued = false;
    rageAttackEndTime = 0;
    isInvulnerable = false;
    invulnerableEndTime = 0;
    invulnerableDuration = 500;

    IMAGES_WALKING = [
        'image/4_enemie_boss_chicken/1_walk/G1.png',
        'image/4_enemie_boss_chicken/1_walk/G2.png',
        'image/4_enemie_boss_chicken/1_walk/G3.png',
        'image/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_HURT = [
        'image/4_enemie_boss_chicken/4_hurt/G21.png',
        'image/4_enemie_boss_chicken/4_hurt/G22.png',
        'image/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'image/4_enemie_boss_chicken/5_dead/G24.png',
        'image/4_enemie_boss_chicken/5_dead/G25.png',
        'image/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    IMAGES_ATTACK = [
        'image/4_enemie_boss_chicken/3_attack/G13.png',
        'image/4_enemie_boss_chicken/3_attack/G14.png',
        'image/4_enemie_boss_chicken/3_attack/G15.png',
        'image/4_enemie_boss_chicken/3_attack/G16.png',
        'image/4_enemie_boss_chicken/3_attack/G17.png',
        'image/4_enemie_boss_chicken/3_attack/G18.png',
        'image/4_enemie_boss_chicken/3_attack/G19.png',
        'image/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_ALERT = [
        'image/4_enemie_boss_chicken/2_alert/G5.png',
        'image/4_enemie_boss_chicken/2_alert/G6.png',
        'image/4_enemie_boss_chicken/2_alert/G7.png',
        'image/4_enemie_boss_chicken/2_alert/G8.png',
        'image/4_enemie_boss_chicken/2_alert/G9.png',
        'image/4_enemie_boss_chicken/2_alert/G10.png',
        'image/4_enemie_boss_chicken/2_alert/G11.png',
        'image/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    /**
     * Creates a new endboss instance.
     */
    constructor() {
        super();
        this.loadBossImages();
        this.x = 1800;
    }

    /**
     * Loads all images for the endboss.
     */
    loadBossImages() {
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
    }

    /**
     * Starts the endboss animation loop.
     */
    animate() {
        if (this.animateIntervalId) return;
        this.animateIntervalId = setInterval(() => {
            if (!this.isWorldReady()) return;
            this.updateState();
            this.handleState();
        }, 300);
    }

    /**
     * Stops the endboss animation loop.
     */
    stopAnimate() {
        if (!this.animateIntervalId) return;
        clearInterval(this.animateIntervalId);
        this.animateIntervalId = null;
    }

    /**
     * Checks whether world and character are available.
     * @returns {boolean} True if world is ready.
     */
    isWorldReady() {
        return !!this.world && !!this.world.character;
    }

    /**
     * Updates the current state of the endboss.
     */
    updateState() {
        this.updateInvulnerability();
        if (this.isDead()) return this.state = 'DEAD';
        if (!this.hasSeenCharacter && this.isCharacterNear()) {this.hasSeenCharacter = true;}
        if (!this.hasSeenCharacter) return this.state = 'IDLE';
        if (this.isHurt()) return this.state = 'HURT';
        if (this.rageAttackQueued) {this.startQueuedRageAttack();}
        if (this.isRageAttackActive()) {
            return this.state = this.isCharacterInAttackRange()
                ? 'ATTACK'
                : 'WALKING';
        }
        this.state = this.isCharacterInAttackRange()
            ? 'ATTACK'
            : 'WALKING';
    }

    /**
     * Starts a queued rage attack after hurt animation.
     */
    startQueuedRageAttack() {
        this.rageAttackQueued = false;
        this.startRageAttack();
    }

    /**
     * Starts a short aggressive chase after getting hit.
     */
    startRageAttack() {
        if (this.isDead()) return;
        this.isRageAttacking = true;
        this.rageAttackEndTime = Date.now() + 1500;
        this.speed = this.rageSpeed;
    }

    /**
     * Checks whether rage attack is still active.
     * @returns {boolean} True if rage attack is active.
     */
    isRageAttackActive() {
        if (!this.isRageAttacking) return false;

        if (Date.now() > this.rageAttackEndTime) {
            this.isRageAttacking = false;
            this.speed = this.normalSpeed;
            return false;
        }

        return true;
    }

    /**
     * Starts a short invulnerability phase.
     */
    startInvulnerability() {
        this.isInvulnerable = true;
        this.invulnerableEndTime = Date.now() + this.invulnerableDuration;
    }

    /**
     * Updates invulnerability state.
     */
    updateInvulnerability() {
        if (!this.isInvulnerable) return;

        if (Date.now() > this.invulnerableEndTime) {
            this.isInvulnerable = false;
        }
    }

    /**
     * Checks whether the character is in attack range.
     * @returns {boolean} True if the character is close enough to attack.
     */
    isCharacterInAttackRange() {
        if (!this.isWorldReady()) return false;
        const distance = Math.abs(this.x - this.world.character.x);
        return distance <= this.attackDistance;
    }

    /**
     * Executes the current state action.
     */
    handleState() {
        switch (this.state) {
            case 'DEAD':
                return this.playDeadState();
            case 'HURT':
                return this.playAnimation(this.IMAGES_HURT);
            case 'IDLE':
                return this.playAnimation(this.IMAGES_ALERT);
            case 'WALKING':
                return this.playWalkingState();
            case 'ATTACK':
                return this.playAttackState();
        }
    }

    /**
     * Plays the walking animation and moves the boss.
     */
    playWalkingState() {
        if (!this.isWorldReady()) return;
        this.playAnimation(this.IMAGES_WALKING);

        if (this.x > this.world.character.x) {
            return this.moveLeftToCharacter();
        }

        this.moveRightToCharacter();
    }

    /**
     * Plays the attack animation.
     */
    playAttackState() {
        this.playAnimation(this.IMAGES_ATTACK);
    }

    /**
     * Moves the boss left toward the character.
     */
    moveLeftToCharacter() {
        this.x -= this.speed;
        this.otherDirection = false;
    }

    /**
     * Moves the boss right toward the character.
     */
    moveRightToCharacter() {
        this.x += this.speed;
        this.otherDirection = true;
    }

    /**
     * Starts the death animation once.
     */
    playDeadState() {
        if (this.isDeadAnimationPlayed) return;
        this.speed = 0;
        this.startDeathAnimation();
    }

    /**
     * Runs the death animation sequence.
     */
    startDeathAnimation() {
        let deathIndex = 0;
        const deathInterval = setInterval(() => {
            deathIndex = this.showNextDeathImage(deathIndex, deathInterval);
        }, 400);
    }

    /**
     * Shows the next death image.
     * @param {number} deathIndex - Current death image index.
     * @param {number} deathInterval - Interval id of death animation.
     * @returns {number} The next death image index.
     */
    showNextDeathImage(deathIndex, deathInterval) {
        this.loadImage(this.IMAGES_DEAD[deathIndex]);
        this.y += 20;
        deathIndex++;

        if (deathIndex >= this.IMAGES_DEAD.length) {
            this.finishDeathAnimation(deathInterval);
        }

        return deathIndex;
    }

    /**
     * Finishes the death animation.
     * @param {number} deathInterval - Interval id of death animation.
     */
    finishDeathAnimation(deathInterval) {
        clearInterval(deathInterval);
        this.isDeadAnimationPlayed = true;
    }

    /**
     * Reduces endboss energy after a hit.
     */
    hit() {
        if (this.isInvulnerable || this.isDead()) return;
        this.energy -= 13;
        if (this.energy < 0) {
            this.energy = 0;
        }
        this.lastHit = Date.now();
        this.rageAttackQueued = true;
        this.startInvulnerability();
    }

    /**
     * Checks if the character is near the endboss.
     * @returns {boolean} True if the character is within 500px.
     */
    isCharacterNear() {
        if (!this.isWorldReady()) return false;
        const distance = Math.abs(this.x - this.world.character.x);
        return distance < 500;
    }

    /**
     * Backward-compatible alias.
     * @returns {boolean} True if the character is within 500px.
     */
    CharacterNear() {
        return this.isCharacterNear();
    }

    /**
     * Checks if the endboss was hit recently.
     * @returns {boolean} True if the hurt state is active.
     */
    isHurt() {
        return Date.now() - this.lastHit < this.hurtDuration;
    }

    /**
     * Checks if the endboss is dead.
     * @returns {boolean} True if energy is 0 or less.
     */
    isDead() {
        return this.energy <= 0;
    }
}