/**
 * Represents a cloud in the game background.
 * Clouds move continuously to the left to create a parallax effect.
 * Inherits from MovableObject.
 */
class Clouds extends MovableObject {
    y = 50;
    width = 500;
    height = 150;
     /**
     * Creates a cloud instance with a random X position
     * and starts its movement to the left.
     */
    constructor() {
        super();  
        this.loadImage('image/5_background/layers/4_clouds/1.png');
        this.x =  Math.random() * 500;
        //this.animate();
    }

animate() {
    setInterval(() => {
        this.moveLeft();
        }, 1000 / 60);
    }
}
