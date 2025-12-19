class Chicken extends MovableObject {
    height = 55;
    width = 90;
    y = 410;
    IMAGES_WALKING = [
        'image/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'image/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'image/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];
    

    // Hitbox offset
    offset = { top: 10, bottom: 5, left: 10, right: 10 };

    constructor() {
        super();
        this.loadImage('../img/chicken/chicken1.png');
        this.loadImages(this.IMAGES_WALKING);
        this.x = 200 + Math.random() * 200;
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
    }

    animate() {
        // Hareket
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        // Animasyon
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 300);
    }
}
