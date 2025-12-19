class World {
character = new Character();
enemies = level1.enemies;
// Canvas ve çizim bağlamı için değişkenler hazırlanır
canvas;
ctx;
keyboard;
camera_x = 0;
statusBar = new StatusBar();
throwableObjects = [];
// Bulutlar listesi (şimdilik 1 tane bulut)
clouds= level1.clouds
 // Arka plan resimleri listesi
backgroundObjects = level1.backgroundObjects;
// level class inda bütün variable ulasmak icin
level = level1;

constructor(canvas,keyboard){
    // Canvas’ın 2D çizim motoru alınır
    this.ctx = canvas.getContext("2d");
     // Canvas referansı world içine kaydedilir
    this.canvas = canvas;
    this.keyboard = keyboard;
     // Oyunun çizim döngüsü başlatılır
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
    }, 200);
}

checkThrowObjects(){
    if(this.keyboard.D){
        let bottle = new ThrowableObject(this.character.x +50, this.character.y +70);
        this.throwableObjects.push(bottle)
    }
}

checkCollision() {
    this.level.enemies.forEach(enemy => {
        if (this.character.isColliding(enemy) && !this.character.isHurt()) {
            this.character.hit();
            this.statusBar.setPercentage(this.character.energy)
             console.log('CARPISMA OLDU VE ENERGY:', this.character.energy);
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
    this.ctx.restore(); // translate'i geri al

    // UI / Status bar (kamera ile değil, sabit ekranda)
    this.addToMap(this.statusBar);
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