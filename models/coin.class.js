class Coins extends DrawableObject {

    offset = { top: 20, bottom: 20, left: 20, right: 20 };

    IMAGES = [
        'image/8_coin/coin_1.png',
        'image/8_coin/coin_2.png',
    ]
    constructor() {
        super();
        this.loadImage('image/8_coin/coin_1.png');
        this.loadImages(this.IMAGES)
        this.width = 100;
        this.height = 100;
        this.x = 100 + Math.random()* 900;
        this.y = 150 + Math.random()* 350;
        this.animate();
    }
    animate(){
       setInterval(() => {
        this.playAnimation(this.IMAGES)
       }, 200);
    }
    playAnimation(images) {
        let i = this.currentImage % images.length;
        this.img = this.imageCache[images[i]];
        this.currentImage++;
    }
}