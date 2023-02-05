import { readdirSync } from 'node:fs'
import { debug, italic } from '../loggingEngine/logging.js'
import { Platform } from './platform.js'

export const loadPlatforms = async (): Promise<Platform[]> => {
  debug('multiplatformEngine.loader', 'Loading platforms...')
  const platforms: Platform[] = []
  const files = readdirSync('./dist/multiplatformEngine/platforms', { withFileTypes: true })
    .filter(dirent => dirent.isFile())
    .filter(dirent => dirent.name.endsWith('.js'))
    .map(dirent => dirent.name)
  for (const plat of files) {
    debug('multiplatformEngine.loader', `Loading platform ${italic(plat.split('.')[0])}`)
    const commandModule = await import(`./platforms/${plat}`)
    const platform = new commandModule.default()
    platforms.push(platform)
  }

  return platforms
}