import ld from 'lodash'

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
    this.lifeGui = this.scene.add.container(0, 0)

    if (!(
      frame === 'structures4.png'
      || frame === 'structures5.png'
    )) {
      this.lifeGui.visible = false
    }

    this.bar = this.scene.add.sprite(0, 0, 'entities', 'bar.png')
    this.lifeBar = this.scene.add.sprite(0, 0, 'entities', 'bar_life.png')

    this.bar.setScale(15, 1)
    this.lifeBar.setScale(13, 1)

    this.bar.setOrigin(0.5, 0.5)
    this.lifeBar.setOrigin(0.5, 0.5)

    this.lifeGui.add(this.bar)
    this.lifeGui.add(this.lifeBar)

    const style = { font: '24px press_start', fill: '#ffffff', stroke: 'black', strokeThickness: 5, align: 'right' }
    const icon = this.scene.add.sprite(0, 0, 'entities', 'resources6.png')
    const text = this.scene.add.text(icon.x - 20, icon.y, '+1', style)
    text.setOrigin(1, 0.5)

    this.gui.add(icon)
    this.gui.add(text)
    this.gui.setScale(0.25)

    this.gui.setAlpha(0)
    this.makes = { gold: 10 }
    this.icon = icon
    this.text = text
    this.life = 100
  }

  setGenerates (makes) {
    this.makes = makes
  }

  update () {
    super.update(...arguments)
    if (!this.active) return

    this.lifeGui.depth = this.scene.depths.bullets + 0.0001

    this.lifeGui.x = this.x

    if (this.lifeGui.visible) {
      const atlas = this.scene.state.entities.atlas
      if (atlas) {
        if (
          Math.abs(atlas.body.velocity.x) >= 50
          || Math.abs(atlas.body.velocity.y) >= 50  
        ) {
          this.life -= 0.25
        }
      }

      this.lifeBar.setScale(
        (this.life / 100) * 13,
        1
      )

      if (this.life <= 0) {
        this.kill()
      }
    }
  }

  kill () {
    this.setActive(false)
    this.killing = true

    this._tween = this.scene.tweens.add({
      targets: this,
      props: {
        y: '-=10',
        alpha: 0
      },
      duration: 500,
      ease: 'Power1',
      onComplete: this.killBuilding.bind(this)
    })
  }

  killBuilding () {
    this.gui.destroy()
    this.lifeGui.destroy()
    this.scene.tweens.killTweensOf(this)
    this.scene.state.entities.ground.killBuilding(
      this
    )
  }

  onAddResource () {
    if (!this.makes) return;
    if (this.killing) return;

    this.gui.setAlpha(1)
    this.gui.x = this.x + ((this.gui.list[0].width + this.gui.list[1].width) / 8)
    this.gui.y = this.y
    this.gui.depths = this.scene.data.get('depths').gui

    const resources = this.scene.data.get('resources')
    ld.each(this.makes, (value, key) => {
      switch (key) {
        case 'gold':
          this.icon.setFrame('resources6.png')
          break
        case 'food':
          this.icon.setFrame('resources4.png')
          break
        case 'stone':
          this.icon.setFrame('resources2.png')
          break
        case 'wood':
          this.icon.setFrame('resources1.png')
          break
      }
      this.text.setText(value)
      resources[key] += value
    })

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
