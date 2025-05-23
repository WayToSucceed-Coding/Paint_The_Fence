const gameData = {
    currentLevel: 0,
    totalScore: 0,
    streak: 0,
    levels: [
        {
            numerator: 1,
            denominator: 2,
            purpose: "Paint half the garden fence",
            bg: "garden-bg",
        },
        {
            numerator: 2,
            denominator: 3,
            purpose: "Paint two-thirds of the garden fence",
            bg: "garden-bg",
        },
        {
            numerator: 3,
            denominator: 4,
            purpose: "Paint three-quarters of the garden fence",
            bg: "garden-bg",
        },
        {
            numerator: 4,
            denominator: 5,
            purpose: "Paint four-fifths of the garden fence",
            bg: "garden-bg",
        },
        {
            numerator: 5,
            denominator: 6,
            purpose: "Paint five-sixths of the garden fence",
            bg: "garden-bg",
        },
        {
            numerator: 1,
            denominator: 3,
            purpose: "Paint one-third of the garden fence",
            bg: "garden-bg",
        },
        {
            numerator: 3,
            denominator: 5,
            purpose: "Paint three-fifths of the garden fence",
            bg: "garden-bg",
        },
        {
            numerator: 5,
            denominator: 8,
            purpose: "Paint five-eighths of the garden fence",
            bg: "garden-bg",
        },
        {
            numerator: 2,
            denominator: 5,
            purpose: "Paint two-fifths of the garden fence",
            bg: "garden-bg",
        },
        {
            numerator: 7,
            denominator: 10,
            purpose: "Paint seven-tenths of the garden fence",
            bg: "garden-bg",
        },
    ],
    generateRandomLevel() {
        const denominators = [2, 3, 4, 5, 6, 7, 8, 10];
        const denominator =
            denominators[Math.floor(Math.random() * denominators.length)];
        const numerator = Math.floor(Math.random() * (denominator - 1)) + 1;

        // Convert fraction to words
        const fractionWords = {
            1: "one",
            2: "two",
            3: "three",
            4: "four",
            5: "five",
            6: "six",
            7: "seven",
            8: "eight",
            9: "nine",
        };
        const denominatorWords = {
            2: "half",
            3: "third",
            4: "fourth",
            5: "fifth",
            6: "sixth",
            7: "seventh",
            8: "eighth",
            10: "tenth",
        };

        let fractionText;
        if (numerator === 1 && denominator === 2) {
            fractionText = "half";
        } else if (numerator === 1) {
            fractionText = `one-${denominatorWords[denominator]}`;
        } else {
            fractionText = `${fractionWords[numerator]}-${denominatorWords[denominator]}s`;
        }

        return {
            numerator,
            denominator,
            purpose: `Paint ${fractionText} of the garden fence`,
            bg: "garden-bg",
        };
    },
};



export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
        this.currentlyPainting = new Set()
    }

    create() {
        this.clickSound = this.sound.add("click-sound", {
            volume: 0.5,
        });

        this.correctSound = this.sound.add("correct-sound", {
            volume: 0.7,
        });

        this.incorrectSound = this.sound.add("incorrect-sound", {
            volume: 0.7,
        });

        this.setupLevel();
    }

    setupLevel() {

        // Clear previous level
        if (this.children) {
            this.children.removeAll();
        }

        // Get current level or generate new one
        let level;
        if (gameData.currentLevel < gameData.levels.length) {
            level = gameData.levels[gameData.currentLevel];
        } else {
            level = gameData.generateRandomLevel();
        }

        this.currentLevel = level;
        level.filled = 0;

        // Background
        this.bg = this.add.tileSprite(400, 300, 800, 600, "garden-bg");

        // Add painter character
        this.painter = this.add
            .image(680, 500, "painter-character")
            .setScale(0.15);

        this.painterIdleTween = this.tweens.add({
            targets: this.painter,
            y: this.painter.y - 5,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
        });

        //Speech bubble over painter
        this.speechBubble = this.add
            .image(690, 350, "speech-bubble")
            .setScale(0.2);

        // Helpful instruction
        this.add
            .text(680, 325, "Click fence sections\n to paint them!", {
                fontFamily: "Inter",
                fontSize: "14px",
                fill: "#00000",
                fontWeight: "500",
            })
            .setOrigin(0.5);

        // Score and Mission Display
        this.createScorePanel();
        this.createMissionInfo();

        // Create fence with actual images
        this.createFenceStructure(level.denominator);

        // Check button
        this.createCheckButton();

        // Track if character is currently painting and initialize queue
        this.isPainting = false;
        this.paintingQueue = [];
    }

    createScorePanel() {
        // Score background
        const scoreBg = this.add
            .image(120, 400, "wooden-sign-blank")
            .setScale(0.2);
        scoreBg.setTint(0xe8f5e9);

        // Score display
        this.add
            .text(80, 360, `Score: ${gameData.totalScore}`, {
                fontFamily: "Inter",
                fontSize: "20px",
                fill: "#ffffff",
                fontWeight: "600",
            })
            .setOrigin(0.5)
            .setAngle(-3);
    }

    createMissionInfo() {


        //Mission info text with better formatting
        this.add
            .text(400, 290, `Mission: ${this.currentLevel.purpose}`, {
                fontFamily: "Inter",
                fontSize: "16px",
                fill: "#000000",
                fontWeight: "500",
                wordWrap: { width: 400 },
                align: "center",
            })
            .setOrigin(0.5);
    }

    createFenceStructure(denominator) {
        const totalWidth = 500;
        const fenceHeight = 100;
        const startX = 150;
        const startY = 220;
        const segmentWidth = totalWidth / denominator;

        this.fenceSegments = [];
        this.paintedFenceSegments = []; // Store painted fence images
        this.segmentWidth = segmentWidth;

        for (let i = 0; i < denominator; i++) {
            const x = startX + i * segmentWidth + segmentWidth / 2;

            // Create unpainted fence segment
            const fenceSegment = this.add
                .image(x, startY, "fence-post")
                .setDisplaySize(segmentWidth, fenceHeight)
                .setInteractive()
                .setData("painted", false)
                .setData("index", i);

            // Create painted fence segment (initially hidden)
            const paintedFenceSegment = this.add
                .image(x, startY, "fence-painted")
                .setDisplaySize(segmentWidth, fenceHeight)
                .setVisible(false)
                .setData("index", i);

            this.fenceSegments.push(fenceSegment);
            this.paintedFenceSegments.push(paintedFenceSegment);

            // Add interactivity with enhanced feedback
            fenceSegment.on("pointerdown", () =>
                this.handleFenceClick(fenceSegment)
            );
            fenceSegment.on("pointerover", () =>
                this.handleFenceHover(fenceSegment, true)
            );
            fenceSegment.on("pointerout", () =>
                this.handleFenceHover(fenceSegment, false)
            );

            // Also add interactivity to painted segments for unpaining
            paintedFenceSegment.setInteractive();
            paintedFenceSegment.on("pointerdown", () =>
                this.handlePaintedFenceClick(paintedFenceSegment)
            );
            paintedFenceSegment.on("pointerover", () =>
                this.handlePaintedFenceHover(paintedFenceSegment, true)
            );
            paintedFenceSegment.on("pointerout", () =>
                this.handlePaintedFenceHover(paintedFenceSegment, false)
            );
        }
    }

    handleFenceClick(fenceSegment) {
        this.clickSound.play();
        const index = fenceSegment.getData("index");

        // Skip if already painting or painted
        if (this.currentlyPainting.has(index) || this.paintedFenceSegments[index].visible) {
            return;
        }

        this.startPaintingAnimation(index);
    }

    startPaintingAnimation(index) {
        const unpaintedFence = this.fenceSegments[index];
        const paintedFence = this.paintedFenceSegments[index];

        this.currentlyPainting.add(index);
        this.currentLevel.filled++;

        // Hide unpainted fence immediately
        unpaintedFence.setVisible(false);

        // Show painted fence with animation
        paintedFence.setVisible(true).setAlpha(0);

        this.tweens.add({
            targets: paintedFence,
            alpha: 1,
            duration: 1000,
            ease: "Linear",
            onComplete: () => {
                this.currentlyPainting.delete(index);
            }
        });

        // Add bounce effect
        this.tweens.add({
            targets: paintedFence,
            scaleX: (this.segmentWidth / 1080) * 1.05,
            scaleY: 0.105,
            duration: 500,
            yoyo: true,
            ease: "Sine.easeInOut"
        });
    }

    handlePaintedFenceClick(paintedFenceSegment) {
        const index = paintedFenceSegment.getData("index");

        // Remove paint immediately (no animation needed for unpaint)
        this.removePaint(index);
    }


    removePaint(index) {
        const unpaintedFence = this.fenceSegments[index];
        const paintedFence = this.paintedFenceSegments[index];

        this.currentLevel.filled--;
        paintedFence.setVisible(false);
        unpaintedFence.setVisible(true).setAlpha(1);

        // Quick bounce animation
        this.tweens.add({
            targets: unpaintedFence,
            scaleX: (this.segmentWidth / 1080) * 1.1,
            scaleY: 0.12,
            duration: 150,
            yoyo: true,
            ease: "Back.easeOut",
            onComplete: () => {
                unpaintedFence.setScale(this.segmentWidth / 1080, 0.1);
            }
        });
    }

    handleFenceHover(fenceSegment, isOver) {
        if (!fenceSegment.getData("painted") && !this.isPainting) {
            fenceSegment.setAlpha(isOver ? 0.8 : 1.0);
            fenceSegment.setScale(
                isOver
                    ? (this.segmentWidth / 1080) * 1.05
                    : this.segmentWidth / 1080,
                isOver ? 0.12 : 0.1
            );
        }
    }

    handlePaintedFenceHover(paintedFenceSegment, isOver) {
        if (!this.isPainting) {
            paintedFenceSegment.setAlpha(isOver ? 0.8 : 1.0);
            paintedFenceSegment.setScale(
                isOver
                    ? (this.segmentWidth / 1080) * 1.05
                    : this.segmentWidth / 1080,
                isOver ? 0.12 : 0.1
            );
        }
    }

    createCheckButton() {
        // Check Button
        const button = this.add
            .image(400, 550, "check-button")
            .setScale(0.3)
            .setInteractive({ useHandCursor: true });

        // Enhanced hover effects
        button.on("pointerover", () => {
            this.tweens.add({
                targets: button,
                scaleX: 0.31,
                scaleY: 0.31,
                duration: 200,
                ease: "Back.easeOut",
            });
        });

        button.on("pointerout", () => {
            this.tweens.add({
                targets: button,
                scaleX: 0.3,
                scaleY: 0.3,
                duration: 200,
            });
        });

        button.on("pointerdown", () => {
            if (!this.isPainting) {
                this.checkAnswer();
            }
        });

        return button;
    }

    checkAnswer() {
        const level = this.currentLevel;

        if (level.filled === level.numerator) {
            this.correctSound.play();
            // Update score and streak
            gameData.totalScore += 10 + gameData.streak * 2;
            gameData.streak++;

            // Success message with enhanced effects
            const successBg = this.add
                .image(400, 275, "wooden-sign-blank")
                .setScale(0.2);
            successBg.setTint(0xe8f5e9);

            const successText = this.add
                .text(400, 230, "Well Done", {
                    fontFamily: "Fredoka",
                    fontSize: "32px",
                    fill: "#ffffff",
                    fontWeight: "700",
                })
                .setOrigin(0.5)
                .setAngle(-5);

            // const contextText = this.add
            //   .text(400, 290, `Perfect! +${10 + gameData.streak * 2} points`, {
            //     fontFamily: "Inter",
            //     fontSize: "18px",
            //     fill: "#1b5e20",
            //     fontWeight: "500",
            //   })
            //   .setOrigin(0.5);

            // const streakText = this.add
            //   .text(400, 310, `Streak: ${gameData.streak} 🔥`, {
            //     fontFamily: "Inter",
            //     fontSize: "16px",
            //     fill: "#ff5722",
            //     fontWeight: "600",
            //   })
            //   .setOrigin(0.5);

            // Enhanced celebration effects
            this.createPaintSplashResponseEffect();
            this.createConfettiEffect();

            // Animate success with bounce
            this.tweens.add({
                targets: successBg,
                scaleX: { from: 0, to: 0.2 },
                scaleY: { from: 0, to: 0.2 },
                duration: 500,
                ease: "Back.easeOut",
            });

            //  this.tweens.add({
            //   targets: [successText, contextText, streakText],
            //   scaleX: { from: 0, to: 1 },
            //   scaleY: { from: 0, to: 1 },
            //   duration: 500,
            //   ease: "Back.easeOut",
            // });

            // Continue to next level
            this.time.delayedCall(1000, () => {
                gameData.currentLevel++;
                this.cameras.main.fadeOut(400, 255, 255, 255);
                this.time.delayedCall(200, () => {
                    this.cameras.main.fadeIn(400, 255, 255, 255);
                    this.setupLevel();
                });
            });
        } else {
            this.incorrectSound.play();
            // Reset streak on incorrect answer
            gameData.streak = 0;

            // Enhanced incorrect answer feedback
            this.cameras.main.shake(300, 0.01);

            const tryAgain = this.add
                .text(400, 250, "Not quite right! Keep painting!", {
                    fontFamily: "Inter",
                    fontSize: "24px",
                    fill: "#ff9800",
                    fontWeight: "600",
                    backgroundColor: "#fff3e0",
                    padding: { x: 20, y: 10 },
                })
                .setOrigin(0.5);

            // Bounce animation for feedback
            this.tweens.add({
                targets: tryAgain,
                scaleX: { from: 0, to: 1.1, to: 1 },
                scaleY: { from: 0, to: 1.1, to: 1 },
                duration: 400,
                ease: "Back.easeOut",
            });

            this.tweens.add({
                targets: tryAgain,
                alpha: 0,
                duration: 2500,
                delay: 1000,
                onComplete: () => tryAgain.destroy(),
            });
        }
    }

    createPaintSplashResponseEffect() {
        // Create yellow paint drops for celebration
        for (let i = 0; i < 15; i++) {
            const splash = this.add
                .circle(
                    400 + Phaser.Math.Between(-200, 200),
                    350 + Phaser.Math.Between(-120, 120),
                    Phaser.Math.Between(3, 8),
                    0xffd700
                )
                .setAlpha(0.8);

            this.tweens.add({
                targets: splash,
                y: splash.y - Phaser.Math.Between(80, 150),
                x: splash.x + Phaser.Math.Between(-50, 50),
                alpha: 0,
                scale: 0,
                duration: 2000,
                ease: "Cubic.easeOut",
                onComplete: () => splash.destroy(),
            });
        }
    }

    createConfettiEffect() {
        const confettiColors = [
            0xffd700, 0xff69b4, 0x00ff7f, 0x1e90ff, 0xff4500,
        ];

        for (let i = 0; i < 15; i++) {
            const confetti = this.add.rectangle(
                400 + Phaser.Math.Between(-100, 100),
                200,
                8,
                8,
                confettiColors[Math.floor(Math.random() * confettiColors.length)]
            );

            this.tweens.add({
                targets: confetti,
                y: 650,
                x: confetti.x + Phaser.Math.Between(-100, 100),
                rotation: Phaser.Math.Between(0, Math.PI * 4),
                alpha: 0,
                duration: 3000,
                ease: "Cubic.easeOut",
                onComplete: () => confetti.destroy(),
            });
        }
    }
}