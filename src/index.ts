import { debug, info, rainbow } from './logging/logging.js'
import { start as startCaching } from './caching/index.js'
import { start as startServer } from './server/index.js'
import { start as startCommandEngine } from './commands/index.js'
import { start as startPlatforms } from './multiplatforms/index.js'
import { start as startDatabase } from './database/index.js'
import { start as startInternalServices } from './internal/index.js'

info('index.main', `welcome to ${rainbow('lastgram!')}`)
debug('index.main', 'debug messages are enabled')

await startInternalServices()
await startCaching()
await startDatabase()
await startCommandEngine()
await startServer()
await startPlatforms()
