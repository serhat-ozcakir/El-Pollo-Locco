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
    

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.soundManager = soundManager;
        this.character.world = this;
        this.setWorld();
        this.draw();
        this.run();
    }

    /**
     * Assigns the world reference to the character and enemies.
     * Starts the enemy animations after assigning the world.
     */
setWorld() {
    this.character.world = this;
    this.level.enemies.forEach(enemy => {
        enemy.world = this;
        if (enemy.animate) enemy.animate();
    });
    this.level.clouds.forEach(cloud => {
        cloud.world = this;
        if (cloud.animate) cloud.animate();
    });
}


    /**
     * Starts the game loop.
     * Checks collisions and game logic every 50ms.
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
     * Checks if the character is throwing bottles.
     * If a bottle is available, it is thrown, cooldown is applied, and status bar updated.
     */

    checkThrowObjects() {
        if (this.keyboard.D && this.bottleStatusBar.bottle > 0 && !this.throwCooldown) {
            this.throwCooldown = true;
            let bottle = new ThrowableObject(this.character.x + 50, this.character.y + 70);
            this.throwableObjects.push(bottle);
            bottle.throw();
            this.bottleStatusBar.bottle--;
            const percentage = (this.bottleStatusBar.bottle / this.bottleStatusBar.maxBottle) * 100;
            this.bottleStatusBar.setPercentage(Math.min(percentage, 100));
            setTimeout(() => this.throwCooldown = false, 500);
        }
    }

    /**
     * Checks collisions between the character and enemies.
     * Updates health bar if the character is hurt.
     * Handles character response (jump, hit) when colliding with enemies.
     */

    checkCollision() {
        this.level.enemies.forEach(enemy => {
            if (this.character.isColliding(enemy)) {
            const characterBottom = this.character.y + this.character.height - this.character.offset.bottom;
            const enemyTop = enemy.y + enemy.offset.top;
                if (enemy instanceof Endboss) {
                    if (!this.character.isHurt()) {
                        this.character.hit();
                        this.soundManager.play('damage');
                        this.healthBar.setPercentage(this.character.energy);
                    }
                } else if (!enemy.isDead) {
                    if (this.character.speedY > 0 && characterBottom < enemyTop + enemy.height / 2 ) {
                        enemy.die();
                        this.character.speedY = -15; 
                    } 
                    else if (!this.character.isHurt()) {
                        this.character.hit();
                        this.soundManager.play('damage');
                        this.healthBar.setPercentage(this.character.energy);
                    }
                }
            }
        });
    }

    /**
     * Checks if the character collects coins.
     * Plays a sound and updates the coin status bar when collected.
     */

    checkCoinCollision() {
            this.level.coins.forEach((coin, index) => {
                if (this.character.isColliding(coin)) {
                    this.soundManager.play('coin');
                    this.level.coins.splice(index, 1);
                    this.coinStatusBar.increase(1);
                }
            });
    }

    /**
     * Checks if the character collects bottles.
     * Plays a sound and updates the bottle status bar when collected.
     */

    checkBottleCollision() {
            this.level.bottles.forEach((bottle, index) => {
                if (this.character.isColliding(bottle)) {
                    this.soundManager.play('bottle');
                    this.level.bottles.splice(index, 1);
                    this.bottleStatusBar.increase(1);
                }
            });
    }

    /**
     * Checks if thrown bottles hit the endboss.
     * Applies damage, updates the endboss status bar, and triggers splash animation if collision occurs.
     */

    checkBottleHitsEndboss() {
        const endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (!endboss || endboss.isDead()) return;
        this.throwableObjects.forEach(bottle => {
            if (bottle.isColliding(endboss) && !bottle.isSplashing) {
                endboss.hit(); 
                const percentage = (endboss.energy / endboss.maxEnergy) * 100;
                this.endbossStatusBar.setPercentage(Math.max(percentage, 0));
                this.soundManager.play('bottle_hit');
                bottle.splash(); 
            }
        });
        this.throwableObjects = this.throwableObjects.filter(
            bottle => !bottle.markedForRemoval
        );
    }

    /**
     * Plays the endboss approach sound when it moves.
     * Stops and resets the sound if the endboss is not moving.
     */
    animateEndbossSound() {
        const endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (!endboss) return;
        const approachSound = this.soundManager.sounds.endboss_approach;
        const bossMusic = this.soundManager.sounds.boss_music;
        const bgMusic = this.soundManager.sounds.background_music;
        const isNear = endboss.CharacterNear();
        if (approachSound.paused) {
            approachSound.loop = true;
            approachSound.play();
        }
        if (this.isGameOver) {
            approachSound.pause();
            bossMusic.pause();
            bgMusic.pause();
            return;
        }
        if (isNear) {
            if (!bgMusic.paused) bgMusic.pause();
            if (bossMusic.paused) {
                bossMusic.currentTime = 0; 
                bossMusic.play();
            }
        } else {
            if (!bossMusic.paused) bossMusic.pause();
            if (bgMusic.paused) bgMusic.play();
        }
    }

    /**
     * Checks end-of-game conditions.
     * Displays game over if the character dies, or win screen if the endboss is defeated.
     */

    checkEndConditions() {
            const endboss = this.level.enemies.find(e => e instanceof Endboss);
            if (endboss && endboss.isDead() && endboss.isDeadAnimationPlayed) {
                this.isGameOver = true;
                this.soundManager.play('chicken_dead');
                setTimeout(() => {
                    this.throwableObjects = [];
                    document.getElementById('win-screen').classList.remove('d-none');
                    this.soundManager.stop('background_music');
                    this.soundManager.play('game_win');
                    this.stopGameLoop();
                }, 2000);
            }
            if (this.character.isDead()) {
                this.isGameOver = true;
                document.getElementById('gameover-screen').classList.remove('d-none');
                this.soundManager.play('character_dead');
                this.soundManager.stop('background_music');
                this.stopGameLoop();
            }
    }

    /**
     * Stops the game loop and all animations.
     * Clears intervals and animation frames to prevent ongoing updates.
     */

    stopGameLoop() {
            if (this.character) this.character.stopAnimate();
            this.level.enemies.forEach(enemy => {
                if (enemy.stopAnimate) enemy.stopAnimate();
            });

            // run interval'ını durdur
            if (this.gameIntervalId) {
                clearInterval(this.gameIntervalId);
                this.gameIntervalId = null;
            }

            // draw animationFrame'ini iptal et
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
        }

    /**
     * Draws the game scene.
     * Draws character, enemies, background, throwable objects, and UI bars.
     * Handles camera and scrolling within this function.
     */

    draw(){
            if (this.isGameOver) return; 
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.save();
            this.ctx.translate(this.camera_x, 0);
            this.level.backgroundObjects.forEach(obj => this.addToMap(obj));
            this.level.clouds.forEach(cloud => this.addToMap(cloud));
            this.addToMap(this.character);
            this.level.enemies.forEach(enemy => this.addToMap(enemy));
            this.throwableObjects.forEach(bottle => this.addToMap(bottle));
            this.level.coins.forEach(coin => this.addToMap(coin));
            this.level.bottles.forEach(bottle => this.addToMap(bottle));
            this.ctx.restore();
            // UI
            this.addToMap(this.healthBar);
            this.addToMap(this.coinStatusBar);
            this.addToMap(this.bottleStatusBar);
            this.addToMap(this.endbossStatusBar);
            // Kontroller
            this.checkEndConditions();
            this.animateEndbossSound();
            this.animationFrameId = requestAnimationFrame(() => this.draw());
    }

    /**
     * Draws a given object on the canvas.
     * Handles flipping and hitbox drawing if needed.
     * @param {Object} m - The object to draw on the canvas.
     */

addToMap(m) {
    if (m.otherDirection && m.drawFlipped) {
        m.drawFlipped(this.ctx);
    } else {
        m.draw(this.ctx);
    }

    if (this.DEBUG && m.drawHitbox) {
        m.drawHitbox(this.ctx);
    }
}

}
