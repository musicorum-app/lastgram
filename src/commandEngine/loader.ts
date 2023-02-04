import { Command } from './command.js'
import { readdirSync } from 'node:fs'
import { bold, debug, italic } from '../loggingEngine/logging.js'

export const loadCommands = async (): Promise<Command[]> => {
  debug('commandEngine.loader', 'Loading commands...')
  const commands: Command[] = []
  const levels = readdirSync('./dist/commandEngine/commands')
  for (const protection of levels) {
    const commandsInLevel = readdirSync(`./dist/commandEngine/commands/${protection}`)
    for (const command of commandsInLevel) {
      debug('commandEngine.loader', `Loading command ${italic(command.split('.')[0])} in protection level ${bold(protection)}`)
      const commandModule = await import(`./commandEngine/commands/${protection}/${command}`)
      commands.push({
        name: command.split('.')[0],
        protectionLevel: protection,
        run: commandModule.default,
        ...commandModule.info
      })
    }
  }

  return commands
}