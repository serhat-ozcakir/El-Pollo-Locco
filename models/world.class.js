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
throwableObjects = [];
clouds= level1.clouds
backgroundObjects = level1.backgroundObjects;
level = level1;
throwCoolDown = false;

constructor(canvas,keyboard){
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();

}

setWorld(){
    this.character.world = this;
}

run(){
    setInterval(() => {
        this.checkCollision();
        this.checkThrowObjects();
         this.checkCoinCollision();
         this.checkBottleCollision();
    }, 50);
}

checkThrowObjects(){
    if(this.keyboard.D && this.bottleStatusBar.bottle > 0 && !this.throwCooldown){
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
        if (this.character.isColliding(enemy) && !this.character.isHurt()) {
            this.character.hit();
            this.healthBar.setPercentage(this.character.energy)
             console.log('CARPISMA OLDU VE ENERGY:', this.character.energy);
        }
    });
}

checkCoinCollision(){
    this.level.coins.forEach((coin, index)=> {
        if (this.character.isColliding(coin)){
            console.log('Coin toplandı:', index);
            this.level.coins.splice(index, 1);
            this.coinStatusBar.increase(1); // veya 1
        }
    });
}


checkBottleCollision(){
    this.level.bottles.forEach((bottle, index)=> {
        if (this.character.isColliding(bottle)){
            console.log('Coin toplandı:', index);
            this.level.bottles.splice(index, 1);
            this.bottleStatusBar.increase(1);
        }
    });
}




draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // ------------------------------
    // Oyun dünyası (kamera ile hareket edenler)
    this.ctx.save();
    this.ctx.translate(this.camera_x, 0);

    this.level.backgroundObjects.forEach(obj => this.addToMap(obj));
    this.level.clouds.forEach(cloud => this.addToMap(cloud));
    this.addToMap(this.character);
    this.level.enemies.forEach(enemy => this.addToMap(enemy));
    this.throwableObjects.forEach(item => {
     this.addToMap(item)
    });
    this.level.coins.forEach(coin=> this.addToMap(coin));
    this.level.bottles.forEach(bottle=> this.addToMap(bottle));
    this.ctx.restore(); // translate'i geri al

    // UI / Status bar (kamera ile değil, sabit ekranda)
    this.addToMap(this.healthBar);
    this.addToMap(this.coinStatusBar);
    this.addToMap(this.bottleStatusBar);
    // ------------------------------

    this.checkCollision();

    requestAnimationFrame(() => this.draw());
}


drawNormal(m) {
    this.ctx.drawImage(m.img, m.x, m.y, m.width, m.height);
}

drawFlipped(m) {
    this.ctx.save();
    this.ctx.translate(m.x + m.width, 0);
    this.ctx.scale(-1, 1);
    this.ctx.drawImage(m.img, 0, m.y, m.width, m.height);
    this.ctx.restore();
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