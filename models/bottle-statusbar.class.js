class BottleStatusBar extends StatusBar {
    IMAGES = [
        'image/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'image/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'image/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'image/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'image/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'image/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
    ];

    constructor() {
        super();
        this.y = 100;
        this.loadImages(this.IMAGES);
        this.setPercentage(0);
    }
}