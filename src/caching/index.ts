import { debug, error, info, warn } from '@/logging/logging'
import InMemoryBackend from './inMemory.js'
import { CachingBackend } from './backend.js'
import RedisBackend from './redis.js'
import { isDevelopment } from '@/utils'

export let backend: CachingBackend | undefined

export const start = async () => {
    debug('caching.start', 'starting caching engine')
    try {
        let redisBackend: RedisBackend | undefined = new RedisBackend()
        if (await redisBackend!.start()) {
            info('caching.start', 'using redis as cache backend')
            backend = redisBackend
        }
    } catch (e) {
        if (!isDevelopment) {
            error('caching.start', 'preposterous caching configuration! redis was not found, exiting')
            process.exit(1)
        }
        warn('caching.start', 'redis was not found, using simple in-memory')
        backend = new InMemoryBackend()
    }
}
