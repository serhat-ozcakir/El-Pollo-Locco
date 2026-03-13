/**
 * Represents the final boss enemy in the game.
 * Inherits from Enemy.
 */

class Endboss extends MovableObject {
    height = 400;
    width = 220;
    y = 55;
    energy = 100;
    maxEnergy = 100;
    isDeadAnimationPlayed = false;
    speed = 47;
    alertTime = 0; 
    attackDistance = 40; 

    IMAGES_WALKING = [
        'image/4_enemie_boss_chicken/1_walk/G1.png',
        'image/4_enemie_boss_chicken/1_walk/G2.png',
        'image/4_enemie_boss_chicken/1_walk/G3.png',
        'image/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    IMAGES_HURT = [
        'image/4_enemie_boss_chicken/4_hurt/G21.png',
        'image/4_enemie_boss_chicken/4_hurt/G22.png',
        'image/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'image/4_enemie_boss_chicken/5_dead/G24.png',
        'image/4_enemie_boss_chicken/5_dead/G25.png',
        'image/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    IMAGES_ATTACK = [
        'image/4_enemie_boss_chicken/3_attack/G13.png',
        'image/4_enemie_boss_chicken/3_attack/G14.png',
        'image/4_enemie_boss_chicken/3_attack/G15.png',
        'image/4_enemie_boss_chicken/3_attack/G16.png',
        'image/4_enemie_boss_chicken/3_attack/G17.png',
        'image/4_enemie_boss_chicken/3_attack/G18.png',
        'image/4_enemie_boss_chicken/3_attack/G19.png',
        'image/4_enemie_boss_chicken/3_attack/G20.png',
    ];

    IMAGES_ALERT = [
        'image/4_enemie_boss_chicken/2_alert/G5.png',
        'image/4_enemie_boss_chicken/2_alert/G6.png',
        'image/4_enemie_boss_chicken/2_alert/G7.png',
        'image/4_enemie_boss_chicken/2_alert/G8.png',
        'image/4_enemie_boss_chicken/2_alert/G9.png',
        'image/4_enemie_boss_chicken/2_alert/G10.png',
        'image/4_enemie_boss_chicken/2_alert/G11.png',
        'image/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    state = 'IDLE'; 

    constructor(){
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.x = 1800;
    }

    /**
     * Animates the endboss based on its current state.
     * - DEAD: plays death animation once
     * - HURT: plays hurt animation
     * - IDLE: plays alert animation
     * - WALKING: moves towards the character and plays walking animation
     * - ATTACK: plays attack animation if within attack distance
     */

    animate() {
    setInterval(() => {
        if(this.isDead()){
            this.state = 'DEAD';
        } else if(this.isHurt()){
            this.state = 'HURT';
        } else if(this.CharacterNear()) {
            const distance = Math.abs(this.x - this.world.character.x);
            if (distance > this.attackDistance) {
                this.state = 'WALKING';
            } else {
                this.state = 'ATTACK';  
            }
        } else {
            this.state = 'IDLE';
        }
        switch(this.state){
        case 'DEAD':
            if (!this.isDeadAnimationPlayed) {
                this.speed = 0;
                let deathIndex = 0;
                const deathInterval = setInterval(() => {
                    this.loadImage(this.IMAGES_DEAD[deathIndex]);
                    deathIndex++;
                    if (deathIndex >= this.IMAGES_DEAD.length) {
                        clearInterval(deathInterval);
                        this.isDeadAnimationPlayed = true;
                    }
                    this.y += 20;
                }, 400); 
            }
            break;

            case 'HURT':
                this.playAnimation(this.IMAGES_HURT);          
                break;
            case 'IDLE':
                this.playAnimation(this.IMAGES_ALERT);
                break;
            case 'WALKING':
                this.playAnimation(this.IMAGES_WALKING);
                if(this.x > this.world.character.x) {
                    this.x -= this.speed;
                    this.otherDirection = false;
                } else {
                    this.x += this.speed;
                    this.otherDirection = true;
                }
                break;
            case 'ATTACK':
                this.playAnimation(this.IMAGES_ATTACK);
                break;
        }
    }, 300);
}

     /**
     * Reduces endboss energy when hit by a throwable object.
     * Ensures energy does not drop below 0.
     */

    hit(){
        this.energy -= 13;
        if(this.energy < 0) this.energy = 0;
        this.lastHit = new Date().getTime();
    }

    /**
     * Checks if the player character is within 500px distance of the endboss.
     * @returns {boolean} True if character is near, false otherwise.
     */

    CharacterNear(){
        const distance = Math.abs(this.x - this.world.character.x);
        return distance < 500;
    }

    /**
     * Determines if the endboss is currently in a hurt state.
     * @returns {boolean} True if recently hit, false otherwise.
     */

    isHurt(){
        return (new Date().getTime() - this.lastHit) < 500;
    }

    /**
     * Determines if the endboss is dead (energy <= 0).
     * @returns {boolean} True if dead, false otherwise.
     */
    isDead(){
        return this.energy <= 0;
    }
}
