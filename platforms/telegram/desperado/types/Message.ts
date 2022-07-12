import { User } from './User.js'
import { Chat } from './Chat.js'

export interface Message {
  message_id: number
  from: User
  date: number
  text: string
  reply_to_message?: Message
  chat: Chat
  sender_chat?: Chat
}
