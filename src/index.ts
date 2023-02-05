import { debug, info, rainbow } from './loggingEngine/logging.js'
import { start as startCaching } from './cachingEngine/index.js'
import { start as startServer } from './server/index.js'
import { start as startCommandEngine } from './commandEngine/index.js'
import { start as startPlatforms } from './multiplatformEngine/index.js'
import { start as startDatabase } from './database.js'

info('index.main', `welcome to ${rainbow('lastgram!')}`)
debug('index.main', 'debug messages are enabled')

await startDatabase()
await startCaching()
await startServer()
await startCommandEngine()
await startPlatforms()