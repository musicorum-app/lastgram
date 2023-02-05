import { Base } from './base.js'
import { buildFromTelegramUser, User } from './user.js'

export interface Message extends Base {
  content: string
  sentAt: number
  isAnonymous: boolean
  replyingTo?: Message
  replyingToUser?: User
}

export const buildFromTelegramMessage = (message: Record<string, any>): Message => {
  return {
    content: message.text,
    id: message.message_id.toString(),
    sentAt: message.date,
    isAnonymous: !!message.sender_chat,
    platform: 'telegram',
    replyingTo: message.reply_to_message ? buildFromTelegramMessage(message.reply_to_message) : undefined,
    replyingToUser: message.reply_to_message ? buildFromTelegramUser(message.reply_to_message.from) : undefined
  }
}

