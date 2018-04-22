export default class ResourceMaker extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y, key = 'entities', frame = 'structures2.png') {
    super(scene, x, y, key, frame)
    this.setOrigin(0.5, 1)

    this.scene.time.addEvent({
      delay: 1000,
      callback: this.onAddResource,
      callbackScope: this,
      loop: true
    })

    this.gui = this.scene.add.container(0, 0)

    const style = { font: '24px press_start', fill: '#ffffff', stroke: 'black', strokeThickness: 5, align: 'right' }
    const icon = this.scene.add.sprite(0, 0, 'entities', 'resources6.png')
    const text = this.scene.add.text(icon.x - 20, icon.y, '+1', style)
    text.setOrigin(1, 0.5)

    this.gui.add(icon)
    this.gui.add(text)
    this.gui.setScale(0.25)

    this.gui.setAlpha(0)
  }

  onAddResource () {
    this.gui.setAlpha(1)
    this.gui.x = this.x + ((this.gui.list[0].width + this.gui.list[1].width) / 8)
    this.gui.y = this.y
    this.gui.depths = this.scene.data.get('depths').gui

    const resources = this.scene.data.get('resources')
    this.scene.data.set('resources', Object.assign(resources, {
      gold: resources.gold + 1
    }))

    this.scene.tweens.killTweensOf(this.gui)
    this.scene.tweens.add({
      targets: this.gui,
      props: {
        alpha: 0,
        y: '-=10'
      },
      duration: 1000,
      ease: 'Power1'
    })
  }
}
