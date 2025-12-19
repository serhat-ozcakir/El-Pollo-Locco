class BackgroundObject extends MovableObject {
    width = 720;
    height = 480
    constructor(imagePath, x,) {
        super();
        this.loadImage(imagePath);   //   parametreyi kullan
        this.x = x;
        this.y = 480 - this.height;
       // this.width = 720;  // canvas genişliği kadar
       // this.height = 400; // canvas yüksekliği kadar
    }
}
