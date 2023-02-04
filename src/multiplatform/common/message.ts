import { Base } from './base.js'

export interface Message extends Base {
  content: string
  sentAt: number
  isAnonymous: boolean
}

export const buildFromTelegramMessage = (message: Record<string, any>): Message => {
  return {
    content: message.text,
    id: message.message_id,
    sentAt: message.date,
    isAnonymous: !!message.sender_chat,
    platform: 'telegram'
  }
}

