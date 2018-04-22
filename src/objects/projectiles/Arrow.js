const SPEED = 1000

export default class Arrow extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y) {
    super(scene, x, y, 'entities', 'arrow.png')

    this.scene.physics.world.enable(this)
    this.body.allowGravity = false
    this.body.setSize(48, 12, true)

    this.depth = this.scene.depths.bullets
  }

  update () {
    super.update(...arguments)
    this.lifetime--
  }

  hit () {
    this.kill()
    this.body.enable = false
  }

  kill () {
    this.setActive(false)
    this.setVisible(false)
  }

  reset (x, y, angle) {
    this.setActive(true)
    this.setVisible(true)
    this.x = x
    this.y = y
    this.rotation = angle
    this.lifetime = 300

    this.body.enable = true
    this.body.velocity.setTo(
      Math.cos(angle) * SPEED,
      Math.sin(angle) * SPEED
    )
  }
}
