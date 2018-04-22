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
    for (let i = 0; i < 800; i+= 60) {
      const cloud = this.add.sprite(i, 0, 'entities', 'cloud.png')
      cloud.setAlpha(0.5)
      cloud.setScale(
        0.25 + Phaser.Math.RND.realInRange(0.5, 1.0),
        0.25 + Phaser.Math.RND.realInRange(0.5, 1.0)
      )
      cloud.x += Phaser.Math.RND.integerInRange(0, 60)
      cloud.y += Phaser.Math.RND.integerInRange(0, 400)
    }

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

    const credits = this.add.text(400, 470, 'A game by @Secretmapper', style)
    credits.setInteractive()
    credits.setOrigin(0.5, 1)
  }

  update () {
    if (Phaser.Input.Keyboard.JustDown(this.controls.continue)) {
      this.scene.start('GameScene')
    }
  }
}

export default MenuScene
