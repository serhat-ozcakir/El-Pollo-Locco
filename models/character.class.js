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

    IMAGES_STAYING = [
        'image/2_character_pepe/1_idle/long_idle/I-11.png',
        'image/2_character_pepe/1_idle/long_idle/I-12.png',
        'image/2_character_pepe/1_idle/long_idle/I-13.png',
        'image/2_character_pepe/1_idle/long_idle/I-14.png', 
        'image/2_character_pepe/1_idle/long_idle/I-15.png',
        'image/2_character_pepe/1_idle/long_idle/I-16.png',
        'image/2_character_pepe/1_idle/long_idle/I-17.png',
        'image/2_character_pepe/1_idle/long_idle/I-18.png',
        'image/2_character_pepe/1_idle/long_idle/I-19.png',
        'image/2_character_pepe/1_idle/long_idle/I-20.png',

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
        this.loadImages(this.IMAGES_STAYING);     
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
        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD, 200);
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT, 100);
        } else if (this.isAboveGround()) {
            this.playAnimation(this.IMAGES_JUMPING, 40);
        } else if (this.isStaying()) {
            this.playAnimation(this.IMAGES_STAYING, 400);
        } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING, 20);
        }
            if (this.world.keyboard.UP && !this.isAboveGround()) {
                this.jump();
            }
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);
    }

    jump() {
        this.speedY = -25;
    }
}
