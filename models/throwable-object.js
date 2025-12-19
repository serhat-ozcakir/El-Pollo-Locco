class ThrowableObject extends MovableObject {
    speedX = 6;
    gravity = 1;
    constructor(x, y) {
        super();
        this.loadImage('image/6_salsa_bottle/salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 60;

        this.throw();
    }

    throw() {
        this.speedY = -25;   // yukarı fırlatma

        setInterval(() => {
            // Y ekseni (parabol)
            this.y += this.speedY;
            this.speedY += this.gravity;

            // X ekseni (ileri hareket)
            this.x += this.speedX;
        }, 1000 / 60);
    }
}
