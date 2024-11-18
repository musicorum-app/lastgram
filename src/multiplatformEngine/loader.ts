import { readdirSync } from 'node:fs'
import { debug, italic } from '../loggingEngine/logging.js'
import { Platform } from './platform.js'
import { isBun } from '../utils.js'

const BASE_PATH = isBun ? './src/multiplatformEngine/platforms' : './dist/multiplatformEngine/platforms'

export const loadPlatforms = async () => {
  debug('multiplatformEngine.loader', 'Loading platforms...')
  const platforms: Platform[] = []
  const files = readdirSync(BASE_PATH, { withFileTypes: true })
    .filter(dirent => dirent.isFile())
    .filter(dirent => dirent.name.endsWith('.js') || dirent.name.endsWith('.ts'))
    .map(dirent => dirent.name)
  for (const plat of files) {
    debug('multiplatformEngine.loader', `Loading platform ${italic(plat.split('.')[0])}`)
    const commandModule = await import(`./platforms/${plat}`)
    const platform = new commandModule.default()
    platforms.push(platform)
  }

  return platforms
}