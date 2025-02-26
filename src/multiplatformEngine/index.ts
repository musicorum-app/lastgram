import { Platform } from './platform.js'
import { loadPlatforms } from './loader.js'
import { bold, debug } from '../loggingEngine/logging.js'

class PlatformManager {
  constructor (
    public platforms: Platform[]
  ) {
  }

  startAll () {
    this.platforms.forEach(async platform => {
      debug('multiplatformEngine.manager', `Starting platform ${bold(platform.name)}`)
      await platform.start()
    })
  }

  stopAll () {
    this.platforms.forEach(platform => {
      debug('multiplatformEngine.manager', `Stopping platform ${bold(platform.name)}`)
      platform.stop()
    })
  }

  findPlatform (name: string) {
    return this.platforms.find(platform => platform.name === name)
  }
}

export const loadedPlatforms: Platform[] = await loadPlatforms()
export let platformManager: PlatformManager | undefined

export const start = () => {
  platformManager = new PlatformManager(loadedPlatforms)
  platformManager.startAll()
}