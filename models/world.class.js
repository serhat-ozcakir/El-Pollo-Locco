class World {
    character = new Character();
    enemies = level1.enemies;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    DEBUG = false;
    healthBar = new HealthStatusBar();
    coinStatusBar = new CoinStatusBar();
    bottleStatusBar = new BottleStatusBar();
    endbossStatusBar = new EndbossStatusBar();
    throwableObjects = [];
    clouds = level1.clouds;
    backgroundObjects = level1.backgroundObjects;
    level = level1;
    throwCooldown = false;
    animationFrameId;
    isGameOver = false;
    currentMusicMode = '';

    /**
     * Creates the game world and starts the main loops.
     * @param {HTMLCanvasElement} canvas - The game canvas.
     * @param {Keyboard} keyboard - The keyboard input handler.
     */
    constructor(canvas, keyboard) {
        this.validateDependencies(canvas, keyboard);
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.keyboard = keyboard;
        this.soundManager = soundManager;
        this.setWorld();
        this.startAnimations();
        this.draw();
        this.run();
    }

    /**
     * Validates the required world dependencies.
     * @param {HTMLCanvasElement} canvas - The game canvas.
     * @param {Keyboard} keyboard - The keyboard handler.
     */
    validateDependencies(canvas, keyboard) {
        if (!canvas) throw new Error('Canvas is undefined');
        if (!keyboard) throw new Error('Keyboard is undefined');
    }

    /**
     * Assigns the world reference to all relevant objects.
     */
    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach((enemy) => this.connectObjectToWorld(enemy));
        this.level.clouds.forEach((cloud) => this.connectObjectToWorld(cloud));
    }

    /**
     * Connects an object to the current world.
     * @param {Object} gameObject - The object to connect.
     */
    connectObjectToWorld(gameObject) {
        gameObject.world = this;
    }

    /**
     * Starts all world-related animations.
     */
    startAnimations() {
        this.character.animate();
        this.level.enemies.forEach((enemy) => this.startObjectAnimation(enemy));
        this.level.clouds.forEach((cloud) => this.startObjectAnimation(cloud));
    }

    /**
     * Starts animation if the object supports it.
     * @param {Object} gameObject - The animated object.
     */
    startObjectAnimation(gameObject) {
        if (gameObject.animate) gameObject.animate();
    }

    /**
     * Starts the game loop.
     */
    run() {
        if (this.gameIntervalId) return;
        this.gameIntervalId = setInterval(() => {
            if (this.isGameOver) return;
            this.checkCollision();
            this.checkThrowObjects();
            this.checkCoinCollision();
            this.checkBottleCollision();
            this.checkBottleHitsEndboss();
            this.animateEndbossSound();
        }, 50);
    }

    /**
     * Checks collisions between the character and enemies.
     */
    checkCollision() {
        const collidingEnemies = this.level.enemies.filter(enemy => this.character.isColliding(enemy));
        if (collidingEnemies.length === 0) return;
        const collidingEndboss = collidingEnemies.find(enemy => enemy instanceof Endboss);
        const normalEnemies = collidingEnemies.filter(enemy => !(enemy instanceof Endboss) && !enemy.isDead);
        const stompableEnemies = normalEnemies.filter(enemy => this.canStompEnemy(enemy));
        if (stompableEnemies.length > 0) {
            stompableEnemies.forEach(enemy => this.stompEnemy(enemy));
            return;
        }
        if (collidingEndboss) {
            this.handleEndbossCollision();
            return;
        }
        if (normalEnemies.length > 0) { this.damageCharacter(); }
    }

    /**
     * Handles a collision between the character and the endboss.
     */
    handleEndbossCollision() {
        if (this.character.isHurt()) return;
        this.character.hit();
        this.soundManager.play('damage');
        this.healthBar.setPercentage(this.character.energy);
    }

    /**
     * Checks whether the character can stomp the enemy.
     * @param {Object} enemy - The collided enemy.
     * @returns {boolean} True if the enemy can be stomped.
     */
    canStompEnemy(enemy) {
        const characterBottom =
            this.character.y +
            this.character.height -
            this.character.offset.bottom;
        const enemyTop = enemy.y + enemy.offset.top;
        const safeCollisionDistance = enemy.height * 0.65 + 5;
        return this.character.speedY > 0 &&
            characterBottom < enemyTop + safeCollisionDistance;
    }

    /**
     * Kills the enemy and triggers the bounce effect.
     * @param {Object} enemy - The enemy to defeat.
     */
    stompEnemy(enemy) {
        enemy.die();
        this.character.speedY = -15;
        this.character.startJumpAnimation();
    }

    /**
     * Damages the character if it is not already hurt.
     */
    damageCharacter() {
        if (this.character.isHurt()) return;
        this.character.hit();
        this.soundManager.play('damage');
        this.healthBar.setPercentage(this.character.energy);
    }

    /**
     * Checks if the character throws a bottle.
     */
    checkThrowObjects() {
        if (!this.canThrowBottle()) return;
        this.throwCooldown = true;
        this.createThrownBottle();
        setTimeout(() => {
            this.throwCooldown = false;
        }, 500);
    }

    /**
     * Checks whether a bottle can be thrown.
     * @returns {boolean} True if throwing is allowed.
     */
    canThrowBottle() {
        return this.keyboard.D &&
            this.bottleStatusBar.bottle > 0 &&
            !this.throwCooldown;
    }

    /**
     * Creates and throws a bottle.
     */
    createThrownBottle() {
        const direction = this.character.otherDirection ? -1 : 1;
        const bottleX = this.character.x + (direction === 1 ? 50 : -10);
        const bottle = new ThrowableObject(bottleX, this.character.y + 70);
        this.throwableObjects.push(bottle);
        bottle.throw(direction);
        this.updateBottleStatusBar();
    }

    /**
     * Updates the bottle status bar after throwing.
     */
    updateBottleStatusBar() {
        this.bottleStatusBar.bottle--;
        const percentage = this.getBottlePercentage();
        this.bottleStatusBar.setPercentage(Math.min(percentage, 100));
    }

    /**
     * Returns the current bottle percentage.
     * @returns {number} The bottle percentage.
     */
    getBottlePercentage() {
        return (this.bottleStatusBar.bottle /
            this.bottleStatusBar.maxBottle) * 100;
    }

    /**
     * Checks if the character collects coins.
     */
    checkCoinCollision() {
        this.level.coins.forEach((coin, index) => {
            if (!this.character.isColliding(coin)) return;
            this.soundManager.play('coin');
            this.level.coins.splice(index, 1);
            this.coinStatusBar.increase(1);
        });
    }

    /**
     * Checks if the character collects bottles.
     */
    checkBottleCollision() {
        this.level.bottles.forEach((bottle, index) => {
            if (!this.character.isColliding(bottle)) return;
            this.soundManager.play('bottle');
            this.level.bottles.splice(index, 1);
            this.bottleStatusBar.increase(1);
        });
    }

    /**
     * Checks if thrown bottles hit the endboss.
     */
    checkBottleHitsEndboss() {
        const endboss = this.level.enemies.find(
            (enemy) => enemy instanceof Endboss
        );
        if (!endboss || endboss.isDead()) return;
        this.throwableObjects.forEach((bottle) =>
            this.handleBottleHit(bottle, endboss)
        );
        this.removeUsedBottles();
    }

    /**
     * Handles a bottle collision with the endboss.
     * @param {Object} bottle - The thrown bottle.
     * @param {Endboss} endboss - The endboss instance.
     */
    handleBottleHit(bottle, endboss) {
        if (!bottle.isColliding(endboss) || bottle.isSplashing) return;
        endboss.hit();
        this.updateEndbossStatusBar(endboss);
        this.soundManager.play('bottle_hit');
        bottle.splash();
    }

    /**
     * Updates the endboss status bar.
     * @param {Endboss} endboss - The endboss instance.
     */
    updateEndbossStatusBar(endboss) {
        const percentage = (endboss.energy / endboss.maxEnergy) * 100;
        this.endbossStatusBar.setPercentage(Math.max(percentage, 0));
    }

    /**
     * Removes bottles marked for removal.
     */
    removeUsedBottles() {
        this.throwableObjects = this.throwableObjects.filter(
            (bottle) => !bottle.markedForRemoval
        );
    }

    /**
     * Plays and controls the endboss sounds.
     */
    animateEndbossSound() {
        const endboss = this.level.enemies.find(
            (enemy) => enemy instanceof Endboss
        );
        if (!endboss) return;
        if (this.isGameOver) return this.stopEndbossSounds();
        this.startApproachSound();
        this.updateBossMusic(endboss);
    }

    /**
     * Starts the endboss approach sound safely.
     */
    startApproachSound() {
        this.soundManager.playLoop('endboss_approach');
    }

    /**
     * Stops all endboss-related sounds safely.
     */
    stopEndbossSounds() {
        this.soundManager.pause('endboss_approach');
        this.soundManager.pause('boss_music');
        this.soundManager.pause('background_music');
    }

    /**
     * Updates music mode based on boss distance.
     * @param {Endboss} endboss - The endboss instance.
     */
    updateBossMusic(endboss) {
        if (!endboss.hasSeenCharacter) {
            this.switchToBackgroundMusic();
            return;
        }
        if (this.currentMusicMode === 'boss') return;
        this.currentMusicMode = 'boss';
        this.switchToBossMusic();
    }

    /**
     * Switches to boss music.
     */
    switchToBossMusic() {
        this.soundManager.pause('background_music');
        this.soundManager.playLoop('boss_music');
    }

    /**
     * Switches to background music.
     */
    switchToBackgroundMusic() {
        this.soundManager.pause('boss_music');
        this.soundManager.playLoop('background_music');
    }

    /**
     * Checks the end-of-game conditions.
     */
    checkEndConditions() {
        const endboss = this.level.enemies.find(
            (enemy) => enemy instanceof Endboss
        );
        if (endboss && endboss.isDead() && endboss.isDeadAnimationPlayed) {
            return this.handleWin();
        }
        if (this.character.isDead()) this.handleGameOver();
    }

    /**
     * Handles the win state of the game.
     */
    handleWin() {
        this.isGameOver = true;
        this.soundManager.stop('background_music');
        this.soundManager.stop('boss_music');
        this.soundManager.stop('endboss_approach');
        this.soundManager.play('chicken_dead');
        this.soundManager.play('wind');
        this.soundManager.play('game_win');
        setTimeout(() => {
            this.throwableObjects = [];
            document.getElementById('win-screen').classList.remove('d-none');
            this.stopGameLoop();
        }, 2000);
    }

    /**
     * Handles the game over state.
     */
    handleGameOver() {
        this.isGameOver = true;
        document.getElementById('gameover-screen').classList.remove('d-none');
        this.soundManager.play('character_dead');
        this.soundManager.stop('background_music');
        this.soundManager.stop('boss_music');
        this.soundManager.stop('endboss_approach');
        this.stopGameLoop();
    }

    /**
     * Stops the game loop and all animations.
     */
    stopGameLoop() {
        if (this.character) this.character.stopAnimate();
        this.level.enemies.forEach((enemy) => {
            if (enemy.stopAnimate) enemy.stopAnimate();
        });
        if (this.gameIntervalId) {
            clearInterval(this.gameIntervalId);
            this.gameIntervalId = null;
        }
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * Draws the complete game scene.
     */
    draw() {
        if (this.isGameOver) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(this.camera_x, 0);
        this.level.backgroundObjects.forEach((obj) => this.addToMap(obj));
        this.level.clouds.forEach((cloud) => this.addToMap(cloud));
        this.addToMap(this.character);
        this.level.enemies.forEach((enemy) => this.addToMap(enemy));
        this.throwableObjects.forEach((bottle) => this.addToMap(bottle));
        this.level.coins.forEach((coin) => this.addToMap(coin));
        this.level.bottles.forEach((bottle) => this.addToMap(bottle));
        this.ctx.restore();
        this.addToMap(this.healthBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.bottleStatusBar);
        this.addToMap(this.endbossStatusBar);
        this.checkEndConditions();
        this.animationFrameId = requestAnimationFrame(() => this.draw());
    }

    /**
     * Draws an object on the canvas.
     * @param {Object} movableObject - The object to draw.
     */
    addToMap(movableObject) {
        if (movableObject.otherDirection && movableObject.drawFlipped) {
            movableObject.drawFlipped(this.ctx);
        } else {
            movableObject.draw(this.ctx);
        }
        if (this.DEBUG && movableObject.drawHitbox) {
            movableObject.drawHitbox(this.ctx);
        }
    }
}