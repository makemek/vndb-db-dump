import vndb from 'vndb'
import {
  map,
  tap,
  take,
  filter,
  retryWhen,
  delayWhen,
  concatMap,
} from 'rxjs/operators'
import { generate, from, interval } from 'rxjs'
import fs from 'fs-extra'
import { nanoid } from 'nanoid'

main({
  startId: parseInt(process.env['START_ID']) || 1,
  toCharId: parseInt(process.env['TO_ID']),
  useMinWait: !!process.env['USE_MIN_WAIT'],
})

async function main({ startId, toCharId, useMinWait }) {
  const allCharacters = []
  const client = vndb.createClient()
  await client.login()

  if(!toCharId) {
    console.log('TO_ID not set, fetch from dbstats')
    const { data: { chars: charAmount } } = await client.dbstats()
    console.log(`character amount: ${charAmount}`)
    toCharId = charAmount
  }
  fetchCharacter(
    client,
    {
      startId,
      toCharId,
      maxResults: 25,
      useMinWait,
    },
  ).subscribe({
      next(characters) {
        allCharacters.push(...characters)
      },
      async complete() {
        await fs.outputJson('dump/character.dump.json', allCharacters)
        client.destroy()
      },
      async errors(error) {
        console.error(error)
        await fs.outputJson(`dump/character-incomplete-${nanoid()}.dump.json`, allCharacters)
        client.destory()
      },
    })
}

function fetchCharacter(client, options) {
  const {
    startId,
    toCharId,
    maxResults,
    useMinWait,
  } = options

  return generate(startId - 1, (n) => n < toCharId, (n) => n += maxResults).pipe(
    map(charId => ({ fromId: charId + 1, toId: charId + maxResults })),
    concatMap(({ fromId, toId }) => {
      console.log(fromId, toId)

      const resultPromise = client.character({
        results: maxResults,
        filters: `id >= ${fromId} and id <= ${toId}`,
      })

      return from(resultPromise).pipe(
        retryWhen(errors => errors.pipe(
          map(response => response.data),
          filter(({ id }) => id === 'throttled'),
          map(({ minwait, fullwait }) => useMinWait? minwait: fullwait),
          tap(waitSec => console.log(`endpoint throttled!, wait: ${waitSec} seconds`)),
          delayWhen(waitSec => interval(waitSec * 1000)),
          take(1),
        )),
      )
    }),
    map(({ data }) => data.items),
  )
}
