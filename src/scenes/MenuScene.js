const style = { font: '12px press_start', fill: '#ffffff', stroke: 'black', strokeThickness: 6, align: 'center' }

class MenuScene extends Phaser.Scene {
  constructor () {
    super({ key: 'MenuScene' })
  }

  create () {
    const KeyCodes = Phaser.Input.Keyboard.KeyCodes
    this.controls = this.input.keyboard.addKeys({
      continue: KeyCodes.SPACE
    })

    const title = this.add.sprite(400, 160, 'entities', 'title1.png')
    title.anims.play('title/idle')

    const atlas = this.add.sprite(400, 300, 'entities', 'atlas1.png')
    atlas.anims.play('atlas/idle')

    const text = this.add.text(400, 400, 'Press Spacebar to Start', style)
    text.setOrigin(0.5, 0)

    this.tweens.add({
      targets: text,
      props: {
        y: '-=20'
      },
      yoyo: true,
      duration: 1000,
      ease: 'Power1',
      repeat: -1
    })

  }

  update () {
    if (Phaser.Input.Keyboard.JustDown(this.controls.continue)) {
      this.scene.start('GameScene')
    }
  }
}

export default MenuScene
