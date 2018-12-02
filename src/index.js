import Worker from './worker'
import { character } from './task'
import { times } from 'lodash'
import fs from 'fs-extra'

async function init() {
  const w1 = await Worker.build()

  const MAX_CHARACTER_ID = 77760
  const ids = times(MAX_CHARACTER_ID, id => id + 1)
  const characters = []
  for(let n = 0; n < ids.length; ++n) {
    const id = ids[n]
    const {
      data: { items }
    } = await w1.executeWithRetry(character.byId, id)
    const char = items[0]
    characters.push(char)
    await fs.outputJson('file.dump.json', characters)
  }
}

init()
