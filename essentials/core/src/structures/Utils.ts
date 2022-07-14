import { Lastgram } from './Lastgram.js'
import {
  CommandContext,
  CommandContextChannel,
  CommandContextUser
} from './types/CommandContext.js'

export default class Utils {
  bot: Lastgram

  constructor(bot: Lastgram) {
    this.bot = bot
  }

  buildCtx(
    platform: string,
    id: string,
    content: string,
    args: string[],
    author: CommandContextUser,
    channel: CommandContextChannel
  ): CommandContext {
    return {
      args,
      author,
      channel,
      content,
      id,
      platform
    }
  }
}
