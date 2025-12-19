class MovableObject extends DrawableObject {

    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    gravity = 1.5;
    groundY = 280;
    lastHit = 0;

    // Offset ile çarpışma alanını ayarlayabilirsiniz
    offset = {top: 10, bottom: 10, left: 10, right: 10};

    applyGravity() {
        setInterval(() => {
            this.y += this.speedY;
            this.speedY += this.gravity;

            if(this.y >= this.groundY){
                this.y = this.groundY;
                this.speedY = 0;
            }
        }, 1000/25);
    }

    isAboveGround() {
        if(this instanceof ThrowableObject){
            return true;
        }else{
            return this.y < this.groundY;
        }
    }

    // Çarpışma fonksiyonu offset ile
    isColliding(m) {
        return this.x + this.width - this.offset.right > m.x + m.offset.left &&
               this.y + this.height - this.offset.bottom > m.y + m.offset.top &&
               this.x + this.offset.left < m.x + m.width - m.offset.right &&
               this.y + this.offset.top < m.y + m.height - m.offset.bottom;
    }

hit() {
    this.energy -= 5;
    if (this.energy < 0) {
        this.energy = 0;
    } else{
        this.lastHit = new Date().getTime();
    }
}

isHurt(){
    let timePassed = new Date().getTime() - this.lastHit;
    timePassed = timePassed / 1000;
    console.log(timePassed);
    return timePassed < 1;
}


isDead(){
    return this.energy == 0;
}
    playAnimation(images) {
        let i = this.currentImage % images.length;
        this.img = this.imageCache[images[i]];
        this.currentImage++;
    }

    drawFlipped(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(this.img, 0, this.y, this.width, this.height);
        ctx.restore();
    }

drawHitbox(ctx) {
    if (this instanceof Character || this instanceof Chicken) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'blue';
        ctx.rect(
            this.x + this.offset.left,
            this.y + this.offset.top,
            this.width - this.offset.left - this.offset.right,
            this.height - this.offset.top - this.offset.bottom
        );
        ctx.stroke();
    }
}


    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }
}
