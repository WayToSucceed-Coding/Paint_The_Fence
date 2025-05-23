// StartScene
export default class StartScene extends Phaser.Scene {
    constructor() {
        super("StartScene");
    }

    preload() {
        // Load images
        this.load.image("garden-bg", "assets/images/garden.png");
        this.load.image("painter-character", "assets/images/character.png");
        this.load.image("fence-post", "assets/images/fence.png");
        this.load.image("fence-painted", "assets/images/fence_yellow.png");
        this.load.image("paint-brush", "assets/images/paint_brush.png");
        this.load.image("play-button", "assets/images/play.png");
        this.load.image("garden-bg", "assets/images/garden.png");
        this.load.image("wooden-sign", "assets/images/wooden_sign.png");
        this.load.image("wooden-sign-blank","assets/images/wooden_sign_blank.png");
        this.load.image("paint-can", "assets/images/paint_can.png");
        this.load.image("play-button", "assets/images/play.png");
        this.load.image("speech-bubble", "assets/images/speech_bubble.png");
        this.load.image("check-button", "assets/images/check_work.png");

        //Load Sound
        this.load.audio("click-sound", "assets/sounds/click.mp3");
        this.load.audio("correct-sound", "assets/sounds/bonus.mp3");
        this.load.audio("incorrect-sound", "assets/sounds/incorrect.mp3");
        
    }

    create() {
        // Add background
        this.bg = this.add.tileSprite(400, 300, 800, 600, "garden-bg");

        // Wooden sign
        const sign = this.add.image(400, 300, "wooden-sign").setScale(0.3)

        // Play button
        const playButton = this.add
            .image(400, 500, "play-button")
            .setScale(0.2)
            .setInteractive({ useHandCursor: true });

        // Button hover effects
        playButton.on("pointerover", () => {
            this.tweens.add({
                targets: playButton,
                scale: 0.23,
                duration: 200,
                ease: "Back.easeOut",
            });
        });

        playButton.on("pointerout", () => {
            this.tweens.add({
                targets: playButton,
                scale: 0.2,
                duration: 200,
            });
        });

        // Add decorative elements
        const painter = this.add
            .image(150, 400, "painter-character")
            .setScale(0.3);
        const paintCan = this.add.image(650, 420, "paint-can").setScale(0.2);

        // Gentle bobbing animations
        this.tweens.add({
            targets: painter,
            y: painter.y - 10,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
        });

        this.tweens.add({
            targets: paintCan,
            angle: 5,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
        });

        // Start game with smooth transition
        playButton.on("pointerdown", () => {
            this.cameras.main.fadeOut(500, 255, 255, 255);
            this.time.delayedCall(500, () => {
                this.scene.start("LoadingScene");
            });
        });
    }
}
