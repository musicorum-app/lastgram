import { CachingBackend } from './backend.js'
import Redis from 'ioredis'
import { error } from '@/logging/logging'

export default class RedisBackend extends CachingBackend {
    public client?: Redis

    constructor() {
        super()

        if (!process.env.REDIS_URL) {
            throw new Error('REDIS_URL is not set in environment variables')
        }
        this.client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
            retryStrategy: () => {
                return 5000
            }
        })
    }

    async start() {
        try {
            this.#registerErrorListener()
            await this.client!.ping()
            return true
        } catch (e) {
            return false
        }
    }

    async get(key: string): Promise<any | undefined> {
        return this.client!.get(key)
    }

    async setTTL(key: string, value: any, ttl: number) {
        await this.client!.set(key, value, 'EX', Math.floor(ttl / 1000))
    }

    async set(key: string, value: any) {
        await this.client!.set(key, value)
    }

    async delete(key: string) {
        await this.client!.del(key)
    }

    async clear() {
    }

    #registerErrorListener() {
        this.client!.on('error', (err: any) => {
            error('caching.redis', `The Redis client encountered an error: ${err}`)
        })
    }
}
