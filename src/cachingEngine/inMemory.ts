import { CachingBackend } from './backend.js'

export default class InMemoryBackend extends CachingBackend {
  private cache: Record<string, any> = {}

  constructor () {
    super()
  }

  async get (key: string) {
    return this.cache[key]
  }

  async setTTL (key: string, value: any, ttl: number) {
    this.cache[key] = value
    setTimeout(() => {
      delete this.cache[key]
    }, ttl)
  }

  async set (key: string, value: any) {
    this.cache[key] = value
  }

  async delete (key: string) {
    delete this.cache[key]
  }

  async clear () {
    this.cache = {}
  }
}