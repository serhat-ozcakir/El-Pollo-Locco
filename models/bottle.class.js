/**
 * Represents a collectible bottle in the game.
 * Inherits from DrawableObject.
 */
class Bottles extends DrawableObject {
    offset = { top: 20, bottom: 20, left: 20, right: 20 };
    IMAGES = [
        'image/6_salsa_bottle/1_salsa_bottle_on_ground.png'
    ]
    constructor(x,y){
        super();
        this.x = x;
        this.y = y -50
        this.loadImage('image/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.width = 100;
        this.height = 100;
    }
   
}