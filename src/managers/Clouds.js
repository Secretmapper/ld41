export default class Clouds {
  constructor (scene) {
    this.scene = scene
    this.group = this.scene.add.group({ runChildUpdate: true })

    for (let i = 1600; i < 6720; i += 500) {
      const cloud = this.scene.add.sprite(i, 0, 'entities', 'cloud.png')
      cloud.setScale(
        0.25 + Phaser.Math.RND.realInRange(0.5, 1.0),
        0.25 + Phaser.Math.RND.realInRange(0.5, 1.0)
      )
      cloud.y += Phaser.Math.RND.integerInRange(0, 400)
      cloud.depth = 0
      this.group.add(cloud)
    }
  }

  update () {
  }
}
