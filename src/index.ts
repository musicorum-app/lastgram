import { debug, info, rainbow } from './loggingEngine/logging.js'
import { start as startCaching } from './cachingEngine/index.js'
import { start as startServer } from './server/index.js'
import { start as startCommandEngine } from './commandEngine/index.js'
import { start as startPlatforms } from './multiplatformEngine/index.js'

info('index.main', `welcome to ${rainbow('lastgram!')}`)
debug('index.main', 'debug messages are enabled')

await startCaching()
await startCommandEngine()
await startPlatforms()
await startServer()