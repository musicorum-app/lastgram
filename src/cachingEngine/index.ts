import { debug, error, info, warn } from '../loggingEngine/logging.js'
import InMemoryBackend from './inMemory.js'
import { CachingBackend } from './backend.js'
import RedisBackend from './redis.js'
import { isDevelopment } from '../utils.js'

export let backend: CachingBackend | undefined

export const start = async () => {
  debug('cachingEngine.start', 'starting cachingEngine engine')
  let redisBackend: RedisBackend | undefined = new RedisBackend()
  if (await redisBackend!.start()) {
    info('cachingEngine.start', 'using redis as cache backend')
    backend = redisBackend
  } else {
    if (!isDevelopment) {
      error('cachingEngine.start', 'preposterous caching configuration! redis was not found, exiting')
      process.exit(1)
    }
    warn('cachingEngine.start', 'redis was not found, using simple in-memory')
    backend = new InMemoryBackend()
  }
}
