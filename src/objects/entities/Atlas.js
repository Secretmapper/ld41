export default class Atlas extends Phaser.GameObjects.Sprite {
  constructor () {
    super(...arguments)

    this.anims.play('atlas/idle')
  }
}
