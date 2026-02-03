import { Base } from './base.js'
import { buildFromTelegramUser, User } from './user.js'
import { ChatInputCommandInteraction } from 'discord.js'

export interface Message extends Base {
    content: string
    sentAt: number
    isAnonymous: boolean
    replyingTo?: Message
    replyingToUser?: User
    mustReply?: boolean
}

export const buildFromTelegramMessage = (message: Record<string, any>): Message => {
    return {
        content: message.text,
        id: message.message_id.toString(),
        sentAt: message.date,
        isAnonymous: !!message.sender_chat,
        platform: 'telegram',
        replyingTo: message.reply_to_message && message.reply_to_message.from.id !== 777000 ? buildFromTelegramMessage(message.reply_to_message) : undefined,
        replyingToUser: message.reply_to_message && message.reply_to_message.from.id !== 777000 ? buildFromTelegramUser(message.reply_to_message.from) : undefined,
        mustReply: message.reply_to_message?.from?.id === 777000
    }
}

export const buildFromDiscordMessage = (message: ChatInputCommandInteraction): Message => {
    return {
        content: '',
        id: message.id,
        sentAt: message.createdTimestamp,
        isAnonymous: false,
        platform: 'discord',
        replyingTo: undefined,
        replyingToUser: undefined
    }
}
