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
    if (!channel) return { id: '', name: '', platform: 'discord', type: 'dm' }

    return {
        id: channel.id,
        // @ts-expect-error
        name: channel.isDMBased() ? channel.recipient!.username : (channel as TextChannel).name,
        type: channel.isDMBased() ? 'dm' : channel.type.toString(),
        platform: 'discord'
    }
}
