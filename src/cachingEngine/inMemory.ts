import { CachingBackend } from './backend.js'

export default class InMemoryBackend extends CachingBackend {
  private cache: Record<string, any> = {}

  constructor () {
    super()
  }

  async get (key: string): Promise<any | undefined> {
    return this.cache[key]
  }

  async setTTL (key: string, value: any, ttl: number): Promise<void> {
    this.cache[key] = value
    setTimeout(() => {
      delete this.cache[key]
    }, ttl)
  }

  async set (key: string, value: any): Promise<void> {
    this.cache[key] = value
  }

  async delete (key: string): Promise<void> {
    delete this.cache[key]
  }

  async clear (): Promise<void> {
    this.cache = {}
  }
}