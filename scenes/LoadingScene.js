export default class LoadingScene extends Phaser.Scene {
    constructor() {
        super("LoadingScene");
    }

    create() {
        // Fade in effect
        this.cameras.main.fadeIn(500, 255, 255, 255);

        // Background with parallax effect
        this.bg = this.add.tileSprite(400, 300, 800, 600, "garden-bg");

        // Enhanced loading text with animation
        const loadingText = this.add
            .text(400, 220, "Preparing the paint...", {
                fontFamily: "Inter",
                fontSize: "32px",
                fill: "#d84315",
                fontWeight: "500",
            })
            .setOrigin(0.5);

        // Animate loading text
        this.tweens.add({
            targets: loadingText,
            alpha: 0.5,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
        });

        // Paint can animation
        const paintCan = this.add.image(400, 450, "paint-can").setScale(0.2);
        this.tweens.add({
            targets: paintCan,
            angle: 10,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
        });

        // Beautiful progress bar design with glow effect
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0xfff3e0, 1);
        progressBox.lineStyle(3, 0xff5722, 1);
        progressBox.fillRoundedRect(240, 250, 320, 50, 25);
        progressBox.strokeRoundedRect(240, 250, 320, 50, 25);

        const progressBar = this.add.graphics();
        const progressGlow = this.add.graphics();

        // Simulate loading with smooth animation
        let progress = 0;
        const timer = this.time.addEvent({
            delay: 60,
            callback: () => {
                progress += 0.03;
                progressBar.clear();
                progressGlow.clear();

                // Glowing progress bar
                progressGlow.fillStyle(0xff9800, 0.3);
                progressGlow.fillRoundedRect(245, 255, 310 * progress, 40, 20);

                // Main progress bar
                progressBar.fillGradientStyle(
                    0xff9800,
                    0xff5722,
                    0xff9800,
                    0xff5722
                );
                progressBar.fillRoundedRect(250, 260, 300 * progress, 30, 15);

                if (progress >= 1) {
                    timer.remove();
                    this.cameras.main.fadeOut(300, 255, 255, 255);
                    this.time.delayedCall(300, () => {
                        this.scene.start("GameScene");
                    });
                }
            },
            callbackScope: this,
            loop: true,
        });
    }
}