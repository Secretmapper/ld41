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

  scene.anims.create({
    key: 'bomb/idle',
    frames: gen('entities', { prefix: 'bomb', suffix: '.png', start: 1, end: 2 }),
    frameRate: 3,
    repeat: -1
  })

  scene.anims.create({
    key: 'explosion/explode',
    frames: gen('entities', { prefix: 'explosion', suffix: '.png', start: 1, end: 8 }),
    frameRate: 12,
    repeat: 0,
    hideOnComplete: true
  })

  scene.anims.create({
    key: 'player/idle',
    frames: gen('entities', { prefix: 'jutah', suffix: '.png', start: 1, end: 4 }),
    frameRate: 12
  })

  scene.anims.create({
    key: 'player/walk',
    frames: gen('entities', { prefix: 'jutah', suffix: '.png', start: 5, end: 12 }),
    frameRate: 12
  })

  scene.anims.create({
    key: 'player/plant',
    frames: gen('entities', { prefix: 'jutah', suffix: '.png', start: 16, end: 20 }),
    frameRate: 18
  })

  scene.anims.create({
    key: 'player/jump',
    frames: gen('entities', { prefix: 'jutah', suffix: '.png', start: 17, end: 17 }),
    frameRate: 2
  })

  scene.anims.create({
    key: 'player/dash',
    frames: gen('entities', { prefix: 'jutah', suffix: '.png', start: 7, end: 7 }),
    frameRate: 2
  })

  scene.anims.create({
    key: 'player/roll',
    frames: gen('entities', { prefix: 'jutah', suffix: '.png', start: 24, end: 31 }),
    frameRate: 12
  })

  scene.anims.create({
    key: 'player/fall',
    frames: gen('entities', { prefix: 'jutah', suffix: '.png', start: 19, end: 19 }),
    frameRate: 2
  })

  scene.anims.create({
    key: 'player/hit',
    frames: gen('entities', { prefix: 'jutah', suffix: '.png', start: 32, end: 36 }),
    frameRate: 16
  })

  /** drone **/
  scene.anims.create({
    key: 'drone/fly',
    frames: gen('entities', { prefix: 'drone', suffix: '.png', start: 1, end: 2 }),
    frameRate: 6,
    repeat: -1
  })

  scene.anims.create({
    key: 'drone/hit',
    frames: gen('entities', { prefix: 'drone', suffix: '.png', start: 3, end: 4 }),
    frameRate: 6,
    repeat: -1
  })

  scene.anims.create({
    key: 'drone/dead',
    frames: gen('entities', { prefix: 'drone', suffix: '.png', start: 5, end: 5 }),
    repeat: 0
  })

  scene.anims.create({
    key: 'andy/idle',
    frames: gen('entities', { prefix: 'andy', suffix: '.png', start: 1, end: 3 }),
    repeat: -1,
    frameRate: 12
  })

  scene.anims.create({
    key: 'andy/walk',
    frames: gen('entities', { prefix: 'andy', suffix: '.png', start: 4, end: 8 }),
    repeat: -1,
    frameRate: 12
  })

  scene.anims.create({
    key: 'andy/hit',
    frames: gen('entities', { prefix: 'andy', suffix: '.png', start: 9, end: 10 }),
    frameRate: 12,
    repeat: -1
  })

  scene.anims.create({
    key: 'andy/dead',
    frames: gen('entities', { prefix: 'andy', suffix: '.png', start: 11, end: 11 })
  })

  scene.anims.create({
    key: 'bullet/idle',
    frames: gen('entities', { prefix: 'bullet', suffix: '.png', start: 1, end: 1 }),
  })

  scene.anims.create({
    key: 'bullet/hit',
    frames: gen('entities', { prefix: 'bullet', suffix: '.png', start: 2, end: 5 }),
    repeat: 0
  })

  scene.anims.create({
    key: 'turret/right',
    frames: gen('entities', { prefix: 'turret', suffix: '.png', start: 1, end: 1 })
  })
  scene.anims.create({
    key: 'turret/down',
    frames: gen('entities', { prefix: 'turret', suffix: '.png', start: 2, end: 2 })
  })
  scene.anims.create({
    key: 'turret/left',
    frames: gen('entities', { prefix: 'turret', suffix: '.png', start: 3, end: 3 })
  })
  scene.anims.create({
    key: 'turret/up',
    frames: gen('entities', { prefix: 'turret', suffix: '.png', start: 4, end: 4 })
  })

  scene.anims.create({
    key: 'turret/hit',
    frames: gen('entities', { prefix: 'turret', suffix: '.png', start: 5, end: 6 }),
    frameRate: 12,
    repeat: -1
  })

  scene.anims.create({
    key: 'turret/dead',
    frames: gen('entities', { prefix: 'turret', suffix: '.png', start: 7, end: 7 }),
    repeat: 0
  })

  createAnims(
    'drone_spawner',
    [
      ['blink', 1, 2, { repeat: -1, frameRate: 12 }],
      ['open', 1, 13, { repeat: 0 }],
      ['close', 14, 18, { repeat: 0 }],
      ['hit', 14, 19, {
        repeat: -1,
        frames: [{ key: 'entities', frame: 'drone_spawner14.png' }, { key: 'entities', frame: 'drone_spawner19.png' }]
      }],
      ['dead', 20, 20, { repeat: 0 }],
      ['opened', 13, 13, { repeat: 0 }]
    ]
  )

  createAnims(
    'drone_spawner',
    [
      ['bottom/play', 22, 22, { repeat: -1, frameRate: 12 }],
      ['bottom/hit', 22, 23, { repeat: -1 }],
      ['bottom/dead', 21, 21, { repeat: 0 }]
    ]
  )

  createAnims(
    'yoyo',
    [
      ['open', 1, 13, { frameRate: 18, repeat: 0 }],
      ['expanded', 13, 13, {}],
      ['close', 13, 17, { frameRate: 18, repeat: 0 }],
      ['hit', 17, 18, { frameRate: 16 }],
      ['dead', 19, 19, { frameRate: 1, repeat: 0 }]
    ]
  )

  createAnims(
    'yoyorocket',
    [
      ['play', 1, 7, { frameRate: 12, repeat: -1 }]
    ]
  )

  createAnims(
    'entry_explosion',
    [
      ['play', 1, 14, { frameRate: 12, repeat: 0 }]
    ]
  )
}
