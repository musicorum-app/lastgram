import { buildFromTelegramMessage, Message } from './message.js'
import { buildFromTelegramChannel, Channel } from './channel.js'
import { Replyable } from '../protocols.js'
import { buildFromTelegramUser, User } from './user.js'

export class Context {
  replyWith?: Replyable

  constructor (
    public message: Message,
    public author: User,
    public channel: Channel
  ) {
  }

  static fromTelegramMessage (message: Record<string, any>): Context {
    return new Context(
      buildFromTelegramMessage(message),
      buildFromTelegramUser(message.from),
      buildFromTelegramChannel(message.chat)
    )
  }

  reply (content: Replyable): void {
    this.replyWith = content
  }
}
