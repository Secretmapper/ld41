const style = { font: '12px press_start', fill: '#ffffff', stroke: 'black', strokeThickness: 6, align: 'center' }
const redstyle = { font: '12px press_start', fill: '#ff0000', stroke: 'black', strokeThickness: 6, align: 'center' }

class SplashScene extends Phaser.Scene {
  constructor () {
    super({ key: 'SplashScene' })
  }

  create () {
    this.state = {
      index: 0
    }

    this.melody = this.sound.add('town', { loop: true })
    this.melody.play()

    const KeyCodes = Phaser.Input.Keyboard.KeyCodes
    this.controls = this.input.keyboard.addKeys({
      continue: KeyCodes.SPACE
    })

    this.cameras.main.setBackgroundColor('#000000')

    const town = this.add.sprite(400, 100, 'entities', 'ground.png')
    const townhall = this.add.sprite(400, 100, 'entities', 'structures11.png')
    const atlas = this.add.sprite(400, 200, 'entities', 'atlas1.png')
    atlas.alpha = 0

    const intro = this.add.text(400, 280, 'There once was a town', style)
    intro.setOrigin(0.5, 1)

    const text = this.add.text(780, 460, 'Press Spacebar to Continue', style)
    text.setOrigin(1, 1)

    this.town = town
    this.townhall = townhall
    this.atlas = atlas
  }

  update () {
    if (Phaser.Input.Keyboard.JustDown(this.controls.continue)) {
      if (this.state.index === 0) {
        this.tweens.add({
          targets: this.atlas,
          props: { alpha: 1 },
          duration: 500,
          ease: 'Power1'
        })

        const text = this.add.text(400, 300, 'Carried by the titan Atlas', style)
        text.setOrigin(0.5, 1)
        text.alpha = 0

        this.tweens.add({
          targets: text,
          props: { alpha: 1 },
          duration: 500,
          ease: 'Power1'
        })

      } else if (this.state.index === 1) {
        const text = this.add.text(400, 320, 'Now Zues is angry at Atlas', redstyle)
        text.setOrigin(0.5, 1)
        text.alpha = 0

        this.tweens.add({
          targets: text,
          props: { alpha: 1 },
          duration: 500,
          ease: 'Power1'
        })
      } else if (this.state.index === 2) {
        const text = this.add.text(400, 340, 'So Atlas is on the RUN', style)
        text.setOrigin(0.5, 1)
        text.alpha = 0

        this.atlas.anims.play('atlas/walk')
        this.tweens.add({
          targets: text,
          props: { alpha: 1 },
          duration: 500,
          ease: 'Power1'
        })
      } else {
        this.melody.stop()
        this.scene.start('MenuScene')
      }

      this.state.index++
    }
  }
}

export default SplashScene
