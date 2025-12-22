class EndbossStatusBar extends StatusBar {

    IMAGES = [
        'image/7_statusbars/2_statusbar_endboss/green/green0.png',
        'image/7_statusbars/2_statusbar_endboss/green/green20.png',
        'image/7_statusbars/2_statusbar_endboss/green/green40.png',
        'image/7_statusbars/2_statusbar_endboss/green/green60.png',
        'image/7_statusbars/2_statusbar_endboss/green/green80.png',
        'image/7_statusbars/2_statusbar_endboss/green/green100.png'
    ];
    constructor() {
        super();
        this.y = 10;
        this.x = 500;
        this.loadImages(this.IMAGES);
        this.setPercentage(100);
    }
}