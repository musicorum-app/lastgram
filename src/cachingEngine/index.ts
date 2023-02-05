import { debug, error, info, warn } from '../loggingEngine/logging.js'
import InMemoryBackend from './inMemory.js'
import { CachingBackend } from './backend.js'
import RedisBackend from './redis.js'

let internalBackend: CachingBackend | undefined

export const start = async () => {
  debug('cachingEngine.start', 'starting cachingEngine engine')
  let redisBackend: RedisBackend | undefined = new RedisBackend()
  if (await redisBackend!.start()) {
    info('cachingEngine.start', 'redis was found, using redis')
    internalBackend = redisBackend
  } else {
    warn('cachingEngine.start', 'redis was not found, using simple in-memory')
    internalBackend = new InMemoryBackend()
  }
}

export const backend = () => {
  if (!internalBackend) {
    error('cachingEngine.backend', 'backend was not initialized! stop!')
    throw new Error('backend was not initialized')
  }
  return internalBackend
}