import { Logger } from '@lastgram/logging'

export class Command {
  name
  bot

  constructor(bot) {
    this.bot = bot
  }

  async run(ctx) {
    return 'NO_OP'
  }

  async execute(ctx) {
    if (!this.name)
      throw new Error('Please add the name field to this command.')

    try {
      this.beforeRun(ctx)
    } catch (rst) {
      return rst
    }

    try {
      return await this.run(ctx)
    } catch (e) {
      Logger.error(
        'CommandRunner',
        `Failed to execute ${this.name} for ${ctx.author.name}: ${e.description}`
      )
      // TODO: add i18n
      return `Oopsie! Failed.\n${e.stack}`
    }
  }

  beforeRun(ctx) {}
}
