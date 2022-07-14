import { Database } from '@lastgram/database'
import { Command } from './commands/Command.js'
import aliases from '../resources/aliases.json' assert { type: 'json' }
import Utils from './Utils.js'
import { Logger } from '@lastgram/logging'

export class Lastgram {
  database = new Database()
  #commandRegistry = new Map()
  utils = new Utils(this)

  async findCommandByName(name: string): Promise<Command | undefined> {
    if (!name) return undefined
    name = this.findCommandNameByAlias(name) || name

    return this.#commandRegistry.get(name) || this.#loadCommand(name)
  }

  findCommandNameByAlias(name: string): string {
    return aliases[name]
  }

  async #loadCommand(name: string): Promise<Command> {
    Logger.debug('CommandLoader', `Trying to load ${name}...`)
    const fixedName =
      name
        .split('')
        .map((a, i) => (i === 0 ? a.toUpperCase() : a))
        .join('') + '.js'

    try {
      const command = await import(`../commands/${fixedName}`)
      const cmd = new command.default(this)
      this.#commandRegistry.set(name, cmd)
      Logger.debug('CommandLoader', `Loaded ${name} command.`)
      return cmd
    } catch (e) {
      Logger.debug(
        'CommandLoader',
        `Failed to load ${name}: ${
          e.stack.includes('Cannot find module') ? 'not found' : e.stack
        }`
      )
      this.#commandRegistry.set(name, undefined) // do not try loading the command again
      return undefined
    }
  }
}
