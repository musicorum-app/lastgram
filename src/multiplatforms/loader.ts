import { readdirSync } from 'node:fs'
import { debug, italic } from '../logging/logging.js'
import { Platform } from './platform.js'

const BASE_PATH = './src/multiplatforms/platforms'

export const loadPlatforms = async () => {
    debug('multiplatforms.loader', 'Loading platforms...')
    const platforms: Platform[] = []
    const files = readdirSync(BASE_PATH, { withFileTypes: true })
        .filter(dirent => dirent.isFile())
        .filter(dirent => dirent.name.endsWith('.js') || dirent.name.endsWith('.ts'))
        .map(dirent => dirent.name)
    for (const plat of files) {
        debug('multiplatforms.loader', `Loading platform ${italic(plat.split('.')[0])}`)
        const commandModule = await import(`./platforms/${plat}`)
        const platform = new commandModule.default()
        platforms.push(platform)
    }

    return platforms
}
