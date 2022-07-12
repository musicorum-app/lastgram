import { CommandContext } from './CommandContext.js'
import { Logger } from '../../../logging/Logger.js'

export class Command {
  filters = []

  execute (ctx) {
    return 'NO_OP'
  }

  async run (ctx) {
    try {      const guards = await Promise.all(this.filters.map(z => z(ctx)))
      const failedGuard = guards.filter(a => !a[0])[0]
      if (failedGuard) return failedGuard[1]

      const result = await this.execute(ctx)
      return result
    } catch (e: any) {
      Logger.error('CommandRunner', `Failed to execute ${ctx.commandName} for ${ctx.author.name}: ${e.description}`)
      // TODO: add i18n
      return `Oopsie! Failed.\n${e.stack}`
    }
  }
}
