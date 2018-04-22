const VEL = 50

export default class Ghost extends Phaser.GameObjects.Sprite {
  constructor () {
    super(...arguments)
    this.scene.physics.world.enable(this)
    this.body.setSize(48, 48, true)
    this.body.setOffset(-10, 8)

    this.anims.play('ghost/idle')
    this.acc = new Phaser.Math.Vector2()

    this.neighbors = []

    this.vel = new Phaser.Math.Vector2()
    this.body.maxVelocity.setTo(50, 50)
  }

  update () {
    const entity = this
    if (!entity.active) return

    const target = entity.scene.state.entities.atlas

    if (target && target.active) {
      this.acc.set(target.x - entity.x, target.y - entity.y)
      this.acc.normalize()
      this.acc.x *= VEL
      this.acc.y *= VEL

      entity.body.velocity.x += this.acc.x
      entity.body.velocity.y += this.acc.y
    }

    this.flipX = entity.body.velocity.x > 0

    if (this.neighbors.length > 0) {
      this.vel.set(0, 0)

      for (let i = 0; i < this.neighbors.length; i++) {
        const neighbor = this.neighbors[i]

        this.vel.x += neighbor.x - entity.x
        this.vel.y += neighbor.y - entity.y
      }

      this.vel.x = this.vel.x / this.neighbors.length
      this.vel.y = this.vel.y / this.neighbors.length
      this.vel.x *= -1
      this.vel.y *= -1
      this.vel.normalize(1)
      this.vel.x *= 10
      this.vel.y *= 10

      entity.body.velocity.x += this.vel.x
      entity.body.velocity.y += this.vel.y
    }

    this.neighbors.length = 0
  }

  addNeighbor (agent) {
    this.neighbors.push(agent)
  }

  enemyOverlap (o) {
    this.addNeighbor(o)
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
  }
}
