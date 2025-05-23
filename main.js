import StartScene from "./scenes/StartScene.js";
import LoadingScene from "./scenes/LoadingScene.js";
import GameScene from "./scenes/GameScene.js";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#87ceeb",
    parent: "game-container",
    scene: [StartScene, LoadingScene, GameScene],
    physics: {
        default: "arcade",
        arcade: { debug: false },
    },
};

const game = new Phaser.Game(config);
