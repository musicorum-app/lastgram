import { CachingBackend } from './backend.js'
import { createClient, RedisClientType, RedisModules } from 'redis'
import { error } from '../loggingEngine/logging.js'

export default class RedisBackend extends CachingBackend {
  private client?: RedisClientType<RedisModules>

  constructor () {
    super()

    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: () => {
          return 5
        }
      }
    })
  }

  async start () {
    try {
      await this.client!.connect()
      while (!this.client!.isOpen) {
      }
      if (!this.client!.isReady) {
        await this.client!.disconnect()
        delete this.client
        return false
      }
      this.#registerErrorListener()
      return true
    } catch (e) {
      return false
    }
  }

  async get (key: string): Promise<any | undefined> {
    return this.client!.get(key)
  }

  async setTTL (key: string, value: any, ttl: number) {
    await this.client!.set(key, value, {
      EX: ttl / 1000
    })
  }

  async set (key: string, value: any) {
    await this.client!.set(key, value)
  }

  async delete (key: string) {
    await this.client!.del(key)
  }

  async clear () {
    // UNIMPLEMENTED
  }

  #registerErrorListener () {
    this.client!.on('error', (err) => {
      error('cachingEngine.redis', `The Redis client encountered an error: ${err}`)
    })
  }
}
