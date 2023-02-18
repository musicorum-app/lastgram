import { error } from '../loggingEngine/logging.js'

export const start = () => {
  if (!process.env.DITTO_URL) {
    error('internalEngine.main', 'DITTO_URL is not set')
    process.exit(1)
  }
}
