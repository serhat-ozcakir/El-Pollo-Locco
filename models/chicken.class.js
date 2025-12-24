class Chicken extends MovableObject {
    height = 55;
    width = 90;
    y = 410;
    speed = 0;
    isDead = false;

    IMAGES_WALKING = [
        'image/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'image/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'image/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];
    
    IMAGES_DEAD = [
        'image/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    offset = { top: 10, bottom: 5, left: 10, right: 10 };

    constructor(x) {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = x;
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
    }

    animate() {
        // Hareket
        this.movementInterval = setInterval(() => {
            if(!this.isDead) this.moveLeft();
        }, 1000 / 60);

        // Animasyon
        this.animationInterval = setInterval(() => {
            if(!this.isDead) this.playAnimation(this.IMAGES_WALKING);
        }, 300);
    }
    
    die() {
        this.isDead = true;
        this.speed = 0;
        clearInterval(this.movementInterval);
        clearInterval(this.animationInterval);
        this.playAnimation(this.IMAGES_DEAD);
        setTimeout(() => {
            if(this.world) {
                const index = this.world.level.enemies.indexOf(this);
                if(index > -1) {
                    this.world.level.enemies.splice(index, 1);
                }
            }
        }, 1000); 
    }
}
