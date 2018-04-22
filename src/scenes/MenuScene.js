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

    this.add.text(400, 200, 'Press Spacebar to Start', style)
  }

  update () {
    if (this.controls.continue.isDown) {
      this.scene.start('GameScene')
    }
  }
}

export default MenuScene
