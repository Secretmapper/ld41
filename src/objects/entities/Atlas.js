const VEL = 200
import ld from 'lodash'

export default class Atlas extends Phaser.GameObjects.Sprite {
  constructor () {
    super(...arguments)
    this.scene.physics.world.enable(this)

    this.anims.play('atlas/idle')

    const KeyCodes = Phaser.Input.Keyboard.KeyCodes
    this.body.setSize(80, 130)
    this.controls = this.scene.input.keyboard.addKeys({
      up: KeyCodes.W,
      down: KeyCodes.S,
      left: KeyCodes.A,
      right: KeyCodes.D,
      jump: KeyCodes.SPACE
    })

    this.targetter = this.scene.add.zone(
      0, 0, 400, 300
    )
    this.scene.physics.world.enable(this.targetter)
    this.targetter.setOrigin(0.5, 0.5)
    this.targetter.body.allowGravity = false
    this.targetter.body.setGravity(0, 0)
  }

  update () {
    super.update(...arguments)
    this.lastShotTimer -= 1

    this.targetter.x = this.x - this.targetter.width / 2
    this.targetter.y = this.y - this.targetter.height / 2

    this.body.setVelocityX(this.body.velocity.x * 0.95)

    if (this.controls.left.isDown) {
      this.body.setVelocityX(-VEL)
      this.flipX = true
      this.anims.play('atlas/walk', true)
    } else if (this.controls.right.isDown) {
      this.body.setVelocityX(VEL)
      this.flipX = false
      this.anims.play('atlas/walk', true)
    } else {
      this.anims.play('atlas/idle', true)
    }

    // if (Phaser.Input.Keyboard.JustDown(this.controls.jump)) {
    if (this.controls.jump.isDown) {
      this.jump()
    }

    this.scene.state.entities.ground.x = this.x
    this.SHOT_TIMER_MAX = 180
  }

  jump () {
    if (this.body.blocked.down || this.body.touching.down) {
      if (this.body.velocity.y < 0 || this.body.blocked.down || this.body.touching.down) {
        this.body.setVelocityY(-250)
      }
    }
  }

  onEnemyTargetterOverlap (targetter, enemy) {
    if (this.lastShotTimer > 0) return

    const ground = this.scene.state.entities.ground
    const buildings = ground.state.buildings

    const watchtowers = ld.filter(buildings, (building) => {
      return (
        building
        && building.frame.name === 'structures4.png'
      )
    })
    if (watchtowers.length === 0) return

    this.lastShotTimer = this.SHOT_TIMER_MAX / (watchtowers.length)

    const posX = ground.state.container.x + ld.sample(watchtowers).x
    const posY = ground.state.container.y + watchtowers[0].y

    const angle = Phaser.Math.Angle.Between(
      posX,
      posY,
      enemy.x,
      enemy.y
    )
    this.scene.shooting.dumbShot(posX, posY, angle)
  }
}
