import { Base } from './base.js'

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