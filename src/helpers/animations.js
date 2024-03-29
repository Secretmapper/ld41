export default function makeAnimations (scene) {
  const gen = scene.anims.generateFrameNames.bind(scene.anims)

  const createAnims = (key, anims) => {
    anims.map(anim => {
      const config = anim[3] || {}

      config.key = `${key}/${anim[0]}`
      if (!config.frames) {
        config.frames = gen('entities', { prefix: key, suffix: '.png', start: anim[1], end: anim[2] })
      }

      scene.anims.create(config)
    })
  }

  createAnims(
    'atlas',
    [
      ['idle', 1, 4, { frameRate: 12, repeat: -1 }],
      ['walk', 5, 7, { frameRate: 12, repeat: -1 }],
    ]
  )

  createAnims(
    'person',
    [
      ['idle', 1, 1, { frameRate: 12, repeat: -1 }],
      ['walk', 1, 2, { frameRate: 6, repeat: -1 }],
    ]
  )

  createAnims(
    'ghost',
    [
      ['idle', 1, 4, { frameRate: 12, repeat: -1 }],
    ]
  )

  createAnims(
    'chaser',
    [
      ['walk', 1, 5, { frameRate: 12, repeat: -1 }],
    ]
  )

  createAnims(
    'title',
    [
      ['idle', 1, 4, { frameRate: 12, repeat: -1 }],
    ]
  )
}
