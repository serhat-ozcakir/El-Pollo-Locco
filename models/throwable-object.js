class ThrowableObject extends MovableObject {
    IMAGES = [
        'image/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'image/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'image/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'image/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    speedX = 6;
    gravity = 1;
    isThrown = false; // sadece 1 kere fırlatma kontrolü

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 60;

        this.loadImage('image/6_salsa_bottle/salsa_bottle.png'); // başlangıç resmi
        this.loadImages(this.IMAGES); // animasyon resimlerini yükle

        this.currentImage = 0;
        this.animate(); 
    }

    animate() {
        setInterval(() => {
            if (this.isThrown) {
                this.playAnimation(this.IMAGES);
            }
        }, 1000 / 25);
    }

    throw() {
        if (this.isThrown) return; // zaten fırlatıldıysa çık
        this.isThrown = true;
        this.speedY = -25;

        setInterval(() => {
            this.y += this.speedY;
            this.speedY += this.gravity;
            this.x += this.speedX;
        }, 1000 / 60);
    }

    playAnimation(images) {
        let i = this.currentImage % images.length;
        if (this.imageCache[images[i]]) { // undefined kontrolü
            this.img = this.imageCache[images[i]];
            this.currentImage++;
        }
    }
}
