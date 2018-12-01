import vndb from 'vndb'
import { get } from 'lodash'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export default class Worker {
  constructor(client) {
    this._client = client
  }

  static async build() {
    const client = vndb.createClient()
    await client.login()
    return new Worker(client)
  }

  getClient() {
    return this._client
  }

  async execute(task) {
    const out = await task(this._client)
    return out
  }

  async executeWithRetry(task, context) {
    let pass = false
    let out
    while(!pass) {
      try {
        out = await task(this._client, context)
        pass = true
      } catch(error) {
        if(get(error, 'data.id') !== 'throttled') {
          throw error
        }
        pass = false
        const { data: { minwait } } = error
        await sleep(minwait * 1000)
      }
    }

    return out
  }
}
