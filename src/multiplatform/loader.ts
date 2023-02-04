import { readdirSync } from 'node:fs'
import { debug, italic } from '../loggingEngine/logging.js'
import { Platform } from './platform.js'

export const loadPlatforms = async (): Promise<Platform[]> => {
  debug('multiplatform.loader', 'Loading platforms...')
  const platforms: Platform[] = []
  const files = readdirSync('./dist/multiplatform/platforms')
  for (const plat of files) {
    debug('multiplatform.loader', `Loading platform ${italic(plat.split('.')[0])}`)
    const commandModule = await import(`./multiplatform/platforms/${plat}`)
    const platform = new commandModule.default()
    platforms.push(platform)
  }

  return platforms
}