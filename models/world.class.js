class World {
    character = new Character();
    enemies = level1.enemies;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
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

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
        this.draw();
        this.run();
    }

    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => enemy.world = this);
    }

    run() {
        setInterval(() => {
            this.checkCollision();
            this.checkThrowObjects();
            this.checkCoinCollision();
            this.checkBottleCollision();
            this.checkBottleHitsEndboss();
        }, 50);
    }

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

    checkCollision() {
        this.level.enemies.forEach(enemy => {
            if (this.character.isColliding(enemy)) {
                const characterBottom = this.character.y + this.character.height;
                const enemyTop = enemy.y;
                if (enemy instanceof Endboss) {
                    if (!this.character.isHurt()) {
                        this.character.hit();
                        this.healthBar.setPercentage(this.character.energy);
                    }
                } else {
                    if (!enemy.isDead) {
                        if (characterBottom < enemyTop + 50) {
                            enemy.die();
                            this.character.jump();
                        } else if (!this.character.isHurt()) {
                            this.character.hit();
                            this.healthBar.setPercentage(this.character.energy);
                        }
                    }
                }
            }
        });
    }

    checkCoinCollision() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.level.coins.splice(index, 1);
                this.coinStatusBar.increase(1);
            }
        });
    }

    checkBottleCollision() {
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.level.bottles.splice(index, 1);
                this.bottleStatusBar.increase(1);
            }
        });
    }

    checkBottleHitsEndboss() {
        const endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (!endboss || endboss.isDead()) return;
        this.throwableObjects.forEach((bottle, index) => {
            if (bottle.isColliding(endboss)) {
                endboss.hit();
                const percentage = (endboss.energy / endboss.maxEnergy) * 100;
                this.endbossStatusBar.setPercentage(Math.max(percentage, 0));
                this.throwableObjects.splice(index, 1);
            }
        });
    }

    checkEndConditions() {
        const endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (endboss && endboss.isDead() && endboss.isDeadAnimationPlayed) {
            setTimeout(() => {
                this.throwableObjects = [];
                document.getElementById('win-screen').classList.remove('d-none');
                this.stopGameLoop();
            }, 1000);
        }

        if (this.character.isDead()) {
            document.getElementById('gameover-screen').classList.remove('d-none');
            this.stopGameLoop();
        }
    }

    stopGameLoop() {
        cancelAnimationFrame(this.animationFrameId);
    }

    draw() {
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
        this.checkCollision();
        this.checkCoinCollision();
        this.checkBottleCollision();
        this.checkBottleHitsEndboss();
        this.checkEndConditions();
        this.animationFrameId = requestAnimationFrame(() => this.draw());
    }

    addToMap(m) {
        if (m.otherDirection && m.drawFlipped) {
            m.drawFlipped(this.ctx);
        } else {
            m.draw(this.ctx);
        }
        if (m.drawHitbox) {
            m.drawHitbox(this.ctx);
        }
    }
}
