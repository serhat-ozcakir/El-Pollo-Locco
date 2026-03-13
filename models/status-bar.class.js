/**
 * Class: StatusBar
 * 
 * Represents a status bar (e.g., health, energy) in the game.
 * Displays different images based on the current percentage value.
 * Extends DrawableObject for rendering on the canvas.
 */

class StatusBar extends DrawableObject{

    percentage = 100;
    constructor(){
        super();
        this.x = 0;
        this.y = 0;
        this.width = 200;
        this.height = 60
    }

    /**
     * Updates the percentage value and sets the correct image
     * based on the current percentage.
     * @param {number} percentage - New percentage value (0-100).
     */
    setPercentage(percentage){
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()]
        this.img = this.imageCache[path];
    }  
      
    /**
     * Determines the image index to display based on the current percentage.
     * @returns {number} Index of the image in the IMAGES array.
     */ 
    resolveImageIndex(){
            if(this.percentage == 100){
                return 5;
            } else if(this.percentage > 80){
                return 4;
            } else if(this.percentage > 60){
                return 3;
            } else if(this.percentage > 40){
                return 2;
            }else if(this.percentage > 20){
                return 1;
            } else{
                return 0;
            }
        }
}