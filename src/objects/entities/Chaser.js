const VEL = 200

export default class Chaser extends Phaser.GameObjects.Sprite {
  constructor () {
    super(...arguments)
    this.scene.physics.world.enable(this)
    this.body.setSize(48, 48, true)
    this.body.setOffset(-10, 8)

    this.anims.play('chaser/walk')
  }

  startWalk () {
    this.body.setVelocityX(VEL)
  }

  update () {
    super.update(...arguments)

    if (this.body.blocked.left) {
      this.body.setVelocityX(VEL * 1)
    } else if (this.body.blocked.right) {
      this.body.setVelocityX(VEL * -1)
    }

    this.flipX = (this.body.velocity.x < 0)
  }

  kill () {
    this.body.enable = false
    this.setActive(false)
    this.setVisible(false)
  }

  reset (x, y) {
    this.x = x
    this.y = y
    this.body.enable = true
    this.setActive(true)
    this.setVisible(true)

    this.startWalk()
  }
}
