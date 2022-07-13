import { Command } from './Command.js'

export class FMCommand extends Command {
  async beforeRun(ctx) {
    const d = await this.bot.database.findUser(ctx.platform, ctx.author.id)
    // TODO: localize this
    if (!d) throw 'se registre'
  }
}
