import { Command } from './Command.js'

export class FMCommand extends Command {
  async beforeRun(ctx): Promise<{ user: any }> {
    const user = await this.bot.database.findUser(ctx.platform, ctx.author.id)
    // TODO: localize this
    if (!user) throw 'se registre'
    return { user }
  }
}
