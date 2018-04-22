import Bullet from '../objects/projectiles/Arrow'

const MAX_BULLETS = 50

export default class Shooting {
  constructor (scene) {
    this.scene = scene
    this.scene.shooting = this

    this.arrows = this.scene.physics.add.group({ runChildUpdate: true })

    this.bullets = [this.arrows]
    this.bullets.forEach(bullets => {
      this.scene.physics.add.collider(
        bullets,
        this.scene.map.tiles.bg,
        (bullet, wall) => {
          if (bullet.active && bullet.hit) {
            bullet.hit()
          }
        }
      )
    })

    let bullet
    for (let x = 0; x < MAX_BULLETS; x++) {
      bullet = new Bullet(this.scene, 0, 0)
      this.arrows.add(bullet)
      this.scene.add.existing(bullet)
      bullet.kill()
    }
  }

  dumbShot (x, y, angle) {
    let bullet = this.arrows.getFirstDead(false)

    if (bullet) {
      this.scene.cameras.main.shake(100, 0.001, false)
      bullet.reset(x, y, angle)
    }
  }
}
