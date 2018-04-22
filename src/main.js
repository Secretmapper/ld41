import 'phaser'

import PreloaderScene from './scenes/PreloaderScene'
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
          debug: true,
            gravity: { y: 400 }
        }
    },
    scene: [
        PreloaderScene,
        GameScene
    ]
}

new Phaser.Game(config)
