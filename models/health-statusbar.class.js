class HealthStatusBar extends StatusBar {
    IMAGES = [
        'image/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'image/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'image/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'image/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'image/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'image/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png',
    ];

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.setPercentage(100);
    }
}