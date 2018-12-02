import Worker from './worker'
import { character } from './task'
import { times } from 'lodash'
import fs from 'fs-extra'

async function init() {
  const w1 = await Worker.build()
  const START_ID = 1
  const MAX_CHARACTER_ID = 77791
  const MAX_RESULTS = 25
  let characters = []

  for(let n = START_ID - 1; n < MAX_CHARACTER_ID; n += MAX_RESULTS) {
    const fromId = n + 1
    const toId = n + MAX_RESULTS
    console.log(fromId, toId)
    const {
      data: { items }
    } = await w1.executeWithRetry(
      character.byArg,
      {
        results: MAX_RESULTS,
        filters: `id >= ${fromId} and id <= ${toId}`,
      },
    )
    characters = characters.concat(items)
    console.log('write to file')
    await fs.outputJson('file.dump.json', characters)
  }
}

init()
