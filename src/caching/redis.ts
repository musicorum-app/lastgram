import { CachingBackend } from './backend.js'
import { createClient, RedisClientType, RedisModules } from 'redis'
import { error } from '../loggingEngine/logging.js'

export default class RedisBackend extends CachingBackend {
  private client?: RedisClientType<RedisModules>

  constructor () {
    super()

    this.client = createClient({
      socket: {
        reconnectStrategy: () => {
          return 5
        }
      }
    })
  }

  async start (): Promise<boolean> {
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

  async setTTL (key: string, value: any, ttl: number): Promise<void> {
    await this.client!.set(key, value, {
      EX: ttl
    })
  }

  async set (key: string, value: any): Promise<void> {
    await this.client!.set(key, value)
  }

  async delete (key: string): Promise<void> {
    await this.client!.del(key)
  }

  async clear (): Promise<void> {
    // UNIMPLEMENTED
  }

  #registerErrorListener () {
    this.client!.on('error', (err) => {
      error('caching.redis', `The Redis client encountered an error: ${err}`)
    })
  }
}