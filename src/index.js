import Worker from './worker'
import { dbstats } from './task'

async function init() {
  const w1 = await Worker.build()
  try {
    const x = await w1.execute(dbstats)
    console.log(x)
  } catch(error) {
    console.error(error)
  }
}

init()
