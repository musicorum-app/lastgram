import { Logger } from '@lastgram/logging'
import { Lastgram } from '../Lastgram.js'
import { CommandContext } from '../types/CommandContext.js'
import { CommandReply } from '../types/CommandMisc.js'

export class Command {
  name: string
  bot: Lastgram

  constructor(bot: Lastgram) {
    this.bot = bot
  }

  async run(
    ctx: CommandContext,
    args: object | undefined
  ): Promise<CommandReply> {
    throw new Error('Implement me, please.')
  }

  async execute(ctx: CommandContext): Promise<CommandReply> {
    if (!this.name)
      throw new Error('Please add the name field to this command.')

    let args
    try {
      args = await this.beforeRun(ctx)
    } catch (rst) {
      return rst
    }

    try {
      return this.run(ctx, args)
    } catch (e) {
      Logger.error(
        'CommandRunner',
        `Failed to execute ${this.name} for ${ctx.author.firstName} at ${ctx.channel.name}: ${e.description}`
      )
      // TODO: add i18n
      return `Oopsie! Failed.\n${e.stack}`
    }
  }

  beforeRun(ctx: CommandContext): object {
    return {}
  }
}
