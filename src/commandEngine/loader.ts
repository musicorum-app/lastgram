import { Command } from './command.js'
import { readdirSync } from 'node:fs'
import { bold, debug, italic } from '../loggingEngine/logging.js'
import { isBun } from '../utils.js'

const BASE_PATH = isBun ? './src/commandEngine/commands' : './dist/commandEngine/commands'

const loadCommands = async () => {
  debug('commandEngine.loader', 'Loading commands...')
  const commands: Command[] = []
  const levels = readdirSync(BASE_PATH, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
  for (const protection of levels) {
    const commandsInLevel = readdirSync(`${BASE_PATH}/${protection}`, { withFileTypes: true })
      .filter(dirent => dirent.isFile())
      .filter(dirent => dirent.name.endsWith('.js') || dirent.name.endsWith('.ts'))
      .map(dirent => dirent.name)
    for (const command of commandsInLevel) {
      debug('commandEngine.loader', `Loading command ${italic(command.split('.')[0])} in protection level ${bold(protection)}`)
      const commandModule = await import(`./commands/${protection}/${command}`)
      commands.push({
        name: command.split('.')[0],
        protectionLevel: protection,
        run: commandModule.default,
        aliases: commandModule.aliases ?? [],
        ...commandModule.info,
        // interaction handlers: all non-default exports, excluding info
        interactionHandlers: Object.entries(commandModule)
          .filter(([key]) => key !== 'default' && key !== 'info')
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
      })
    }
  }

  return commands
}

export const loadedCommands = await loadCommands()

export const findCommand = (name: string) => {
  return loadedCommands.find(command => command.name === name || command.aliases?.includes?.(name))
}
