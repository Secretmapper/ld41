import 'phaser'

import PreloaderScene from './scenes/PreloaderScene'
import SplashScene from './scenes/SplashScene'
import MenuScene from './scenes/MenuScene'
import GameScene from './scenes/GameScene'

const config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 800,
    height: 480,
    backgroundColor: '#3B96E2',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 }
        }
    },
    scene: [
        PreloaderScene,
        SplashScene,
        MenuScene,
        GameScene
    ]
}

new Phaser.Game(config)
