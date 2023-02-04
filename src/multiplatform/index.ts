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
      debug('multiplatform.manager', `Starting platform ${bold(platform.name)}`)
      await platform.start()
    })
  }

  stopAll () {
    this.platforms.forEach(platform => {
      debug('multiplatform.manager', `Stopping platform ${bold(platform.name)}`)
      platform.stop()
    })
  }

  findPlatform (name: string): Platform | undefined {
    return this.platforms.find(platform => platform.name === name)
  }
}

export const platformManager = new PlatformManager(await loadPlatforms())

export const start = () => {
  platformManager.startAll()
}