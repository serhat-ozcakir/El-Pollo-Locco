class smallChicken extends MovableObject {
    height = 35;
    width = 40; 
    y = 430;
    energy = 1;
    isDead = false;

    IMAGES_WALKING = [
        'image/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'image/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'image/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'image/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    offset = { top: 10, bottom: 5, left: 10, right: 10 };

    constructor(x) {
        super();
        this.loadImage('image/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 500 + Math.random() * 1500;
        this.speed = 0.15 + Math.random() * 0.3;
        this.animate();
    }
    animate(){
        // Hareket interval'i
        this.movementInterval = setInterval(() => {
            if(!this.isDead) this.moveLeft();
        }, 1000 / 60);

        // Animasyon interval'i
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

        // 1 saniye sonra world.enemies array’den kaldır
        setTimeout(() => {
            if(this.world) { // world tanımlı mı kontrol et
                const index = this.world.level.enemies.indexOf(this);
                if(index > -1) {
                    this.world.level.enemies.splice(index, 1);
                }
            }
        }, 100);
    }

    }