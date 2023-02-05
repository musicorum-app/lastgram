import { Base } from './base.js'

export interface User extends Base {
  username?: string
  name: string
  lastName?: string
  languageCode?: string
  isBot: boolean
}

export const buildFromTelegramUser = (user: Record<string, any>): User => {
  return {
    id: user.id.toString(),
    username: user.username,
    name: user.first_name,
    lastName: user.last_name,
    languageCode: user.language_code,
    isBot: user.is_bot,
    platform: 'telegram'
  }
}