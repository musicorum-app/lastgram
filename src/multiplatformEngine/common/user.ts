import { Base } from './base.js'
import { User as DiscordUser } from 'discord.js'

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

export const buildFromDiscordUser = (user: DiscordUser): User => {
  return {
    id: user.id,
    username: user.username,
    name: user.username,
    isBot: user.bot,
    platform: 'discord'
  }
}