

const level1 = new Level([
    new Chicken(),
    new Chicken(),
    new Chicken(),
    new Endboss()
],
[
    new Clouds()
],
[
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
    new BackgroundObject('image/5_background/layers/1_first_layer/1.png', 719*3),
], 
[
    new Coins(),
    new Coins(),
    new Coins(),
    new Coins(),
    new Coins(),
    new Coins(),
    new Coins(),
    new Coins(),
    new Coins(),
    new Coins(),
    new Coins()
],
 [
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
    ]
)