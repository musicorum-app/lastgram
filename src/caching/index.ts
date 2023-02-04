import { debug, error, info, warn } from '../loggingEngine/logging.js'
import InMemoryBackend from './inMemory.js'
import { CachingBackend } from './backend.js'
import RedisBackend from './redis.js'

let internalBackend: CachingBackend | undefined

export const start = async (): Promise<void> => {
  debug('caching.start', 'starting caching engine')
  let redisBackend: RedisBackend | undefined = new RedisBackend()
  if (await redisBackend!.start()) {
    info('caching.start', 'redis was found, using redis')
    internalBackend = redisBackend
  } else {
    warn('caching.start', 'redis was not found, using simple in-memory')
    internalBackend = new InMemoryBackend()
  }
}

export const backend = (): CachingBackend => {
  if (!internalBackend) {
    error('caching.backend', 'backend was not initialized! stop!')
    throw new Error('backend was not initialized')
  }
  return internalBackend
}