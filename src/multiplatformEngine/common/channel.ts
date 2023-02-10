import { Base } from './base.js'
import { TextBasedChannel, TextChannel } from 'discord.js'

export interface Channel extends Base {
  name: string
  type: string
}

export const buildFromTelegramChannel = (channel: Record<string, any>): Channel => {
  return {
    id: channel.id.toString(),
    name: channel.title,
    type: channel.type,
    platform: 'telegram'
  }
}

export const buildFromDiscordChannel = (channel: TextBasedChannel | null): Channel => {
  if (!channel) return { id: '', name: '', platform: 'discord', type: '' }

  return {
    id: channel.id,
    name: channel.isDMBased() ? channel.recipient!.username : (channel as TextChannel).name,
    type: channel.type.toString(),
    platform: 'discord'
  }
}