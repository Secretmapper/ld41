import Chaser from '../objects/entities/Chaser'

export default class EnemyManager {
  constructor (scene) {
    this.scene = scene
    this.scene.enemies = this

    this._pool = this.scene.add.group({ runChildUpdate: true })

    this.initialize()
  }

  get group () {
    return this._pool
  }

  addAndKill (obj) {
    this._pool.add(obj, true)
    obj.kill()
  }

  initialize () {
    for (let i = 0; i < 10; i++) {
      this.addAndKill(new Chaser(this.scene, 0, 0))
    }
  }

  spawn (args, classType) {
    const obj = this.getFirst(false, false, classType, ...args)
    if (obj) {
      obj.reset(...args)
    }

    return obj
  }

  getFirst (state, createIfNull, classType, x, y, key, frame, visible) {
    if (state === undefined) { state = false }
    if (createIfNull === undefined) { createIfNull = false }

    var gameObject

    var children = this._pool.children.entries

    for (var i = 0; i < children.length; i++) {
      gameObject = children[i]

      if (gameObject.active === state && gameObject instanceof classType) {
        if (typeof(x) === 'number') {
          gameObject.x = x
        }

        if (typeof(y) === 'number') {
          gameObject.y = y
        }

        return gameObject
      }
    }

    if (createIfNull) {
      return this._pool.create(x, y, key, frame, visible)
    }
    else {
      return null
    }
  }

}
