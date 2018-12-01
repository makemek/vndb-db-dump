import vndb from 'vndb'

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
    return await task(this._client)
  }
}
