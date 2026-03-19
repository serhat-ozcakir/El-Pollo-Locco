/**
 * Represents the endboss health bar.
 */
class EndbossStatusBar extends StatusBar {
    IMAGES = [
        'image/7_statusbars/2_statusbar_endboss/green/green0.png',
        'image/7_statusbars/2_statusbar_endboss/green/green20.png',
        'image/7_statusbars/2_statusbar_endboss/green/green40.png',
        'image/7_statusbars/2_statusbar_endboss/green/green60.png',
        'image/7_statusbars/2_statusbar_endboss/green/green80.png',
        'image/7_statusbars/2_statusbar_endboss/green/green100.png',
    ];

    /**
     * Creates the endboss status bar with full health.
     */
    constructor() {
        super();
        this.y = 50;
        this.x = 500;
        this.loadImages(this.IMAGES);
        this.setPercentage(100);
    }
}