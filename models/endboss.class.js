class Endboss extends MovableObject {
    height= 200;
    width=220;
    y = 280;
    IMAGES_WALKING = [
       'image/4_enemie_boss_chicken/2_alert/G5.png',
       'image/4_enemie_boss_chicken/2_alert/G6.png',
       'image/4_enemie_boss_chicken/2_alert/G7.png',
       'image/4_enemie_boss_chicken/2_alert/G8.png',
       'image/4_enemie_boss_chicken/2_alert/G9.png',
       'image/4_enemie_boss_chicken/2_alert/G10.png',
       'image/4_enemie_boss_chicken/2_alert/G11.png',
       'image/4_enemie_boss_chicken/2_alert/G12.png'
    ]
    constructor(){
        super()
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 1800;
        this.animate();
    }
     animate(){
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING)
        }, 300);
     }
}