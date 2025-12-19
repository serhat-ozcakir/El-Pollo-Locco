class Character extends MovableObject {
    height = 200;
    y = 80;
    IMAGES_WALKING = [
        'image/2_character_pepe/2_walk/W-21.png',
        'image/2_character_pepe/2_walk/W-22.png',
        'image/2_character_pepe/2_walk/W-23.png',
        'image/2_character_pepe/2_walk/W-24.png',
        'image/2_character_pepe/2_walk/W-25.png',
        'image/2_character_pepe/2_walk/W-25.png',

    ];

    IMAGES_JUMPING = [
        'image/2_character_pepe/3_jump/J-31.png',
        'image/2_character_pepe/3_jump/J-32.png',
        'image/2_character_pepe/3_jump/J-33.png',
        'image/2_character_pepe/3_jump/J-34.png',
        'image/2_character_pepe/3_jump/J-35.png',
        'image/2_character_pepe/3_jump/J-36.png',
        'image/2_character_pepe/3_jump/J-37.png',
        'image/2_character_pepe/3_jump/J-38.png',
        'image/2_character_pepe/3_jump/J-39.png',
    ]

    IMAGES_DEAD = [
        'image/2_character_pepe/5_dead/D-51.png',
        'image/2_character_pepe/5_dead/D-52.png',
        'image/2_character_pepe/5_dead/D-53.png',
        'image/2_character_pepe/5_dead/D-54.png',
        'image/2_character_pepe/5_dead/D-55.png',
        'image/2_character_pepe/5_dead/D-56.png',
        'image/2_character_pepe/5_dead/D-57.png',
    ]

    IMAGES_HURT = [
        'image/2_character_pepe/4_hurt/H-41.png',
        'image/2_character_pepe/4_hurt/H-42.png',
        'image/2_character_pepe/4_hurt/H-43.png'
    ]


    world;
    speed = 5;
    energy = 100;

    // Hitbox offset
    offset = { top: 50, bottom: 20, left: 15, right: 15 };

    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.applyGravity();
        this.animate();
    }

    animate() {
        setInterval(() => {
            // HAREKET
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
            }
            if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
            }

            // ANİMASYON
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            }
            else {
                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.playAnimation(this.IMAGES_WALKING);
                }
            }

            // ZIPLAMA
            if (this.world.keyboard.UP && !this.isAboveGround()) {
                this.jump();
            }

            // Kamera
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);
    }

    jump() {
        this.speedY = -25;
    }
}
