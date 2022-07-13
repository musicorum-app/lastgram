import { Database } from '@lastgram/database'

const aliases = await import('../resources/aliases.json')

export class Lastgram {
  database = new Database()
  #commandRegistry = new Map()

  async findCommandByName(name) {
    if (!name) return undefined
    name = this.findCommandNameByAlias(name) || name

    return this.#commandRegistry.get(name) || this.#loadCommand(name)
  }

  findCommandNameByAlias(name) {
    return Object.keys(aliases).find((a) => a === name)
  }

  async #loadCommand(name) {
    const fixedName =
      name
        .split('')
        .map((a, i) => (i === 0 ? a.toUpperCase() : a))
        .join('') + '.js'

    try {
      const Command = await import(`../commands/${fixedName}`)
      const cmd = new Command(this)
      this.#commandRegistry.set(name, cmd)
      return cmd
    } catch (e) {
      this.#commandRegistry.set(name, undefined) // do not try loading the command again
      return undefined
    }
  }
}
