class CoinStatusBar extends StatusBar {
    IMAGES = [
        'image/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
        'image/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
        'image/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
        'image/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
        'image/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
        'image/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png',
    ];

    constructor() {
        super();
        this.y = 50;
        this.loadImages(this.IMAGES);
        this.setPercentage(0);
    }
}