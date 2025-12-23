class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    level_end_x = 2200;

    constructor(enemies, clouds, backgroundObjects, coins, bottles){
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
    }

reset() {
    this.enemies = [
        new Chicken(350),
        new smallChicken(600),
        new Chicken(800),
        new smallChicken(1000),
        new Chicken(1150),
        new smallChicken(1300),
        new Endboss(1950)
    ];

    this.clouds = [
        new Clouds()
    ];

    this.backgroundObjects = [
        new BackgroundObject('image/5_background/layers/air.png', -719),
        new BackgroundObject('image/5_background/layers/3_third_layer/1.png', -719),
        new BackgroundObject('image/5_background/layers/2_second_layer/1.png', -719),
        new BackgroundObject('image/5_background/layers/1_first_layer/1.png', -719),
        new BackgroundObject('image/5_background/layers/air.png', 0),
        new BackgroundObject('image/5_background/layers/3_third_layer/2.png', 0),
        new BackgroundObject('image/5_background/layers/2_second_layer/2.png', 0),
        new BackgroundObject('image/5_background/layers/1_first_layer/2.png', 0),
        new BackgroundObject('image/5_background/layers/air.png', 719),
        new BackgroundObject('image/5_background/layers/3_third_layer/1.png', 719),
        new BackgroundObject('image/5_background/layers/2_second_layer/1.png', 719),
        new BackgroundObject('image/5_background/layers/1_first_layer/1.png', 719),
        new BackgroundObject('image/5_background/layers/air.png', 719*2),
        new BackgroundObject('image/5_background/layers/3_third_layer/2.png', 719*2),
        new BackgroundObject('image/5_background/layers/2_second_layer/2.png', 719*2),
        new BackgroundObject('image/5_background/layers/1_first_layer/2.png', 719*2),
        new BackgroundObject('image/5_background/layers/air.png', 719*3),
        new BackgroundObject('image/5_background/layers/3_third_layer/1.png', 719*3),
        new BackgroundObject('image/5_background/layers/2_second_layer/1.png', 719*3),
        new BackgroundObject('image/5_background/layers/1_first_layer/1.png', 719*3)
    ];

    this.coins = [
        new Coins(), new Coins(), new Coins(), new Coins(), new Coins(),
        new Coins(), new Coins(), new Coins(), new Coins(), new Coins(),
        new Coins()
    ];

    this.bottles = [
        new Bottles(300, 380),
        new Bottles(400, 380),
        new Bottles(450, 380),
        new Bottles(600, 380),
        new Bottles(680, 380),
        new Bottles(750, 380),
        new Bottles(1000, 380),
        new Bottles(1200, 380),
        new Bottles(1350, 380),
        new Bottles(1500, 380)
    ];
}

}
