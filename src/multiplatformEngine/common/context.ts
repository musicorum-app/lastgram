import { buildFromTelegramMessage, Message } from './message.js'
import { buildFromTelegramChannel, Channel } from './channel.js'
import { Replyable } from '../protocols.js'
import { buildFromTelegramUser, User } from './user.js'
import { client } from '../../database.js'
import { Prisma } from '@prisma/client'

export type CachedUserData = Prisma.UserGetPayload<{ select: { fmUsername: boolean; language: boolean; id: boolean }; where: any }>

export class Context {
  replyWith?: Replyable
  private cachedResult: CachedUserData | null

  constructor (
    public message: Message,
    public author: User,
    public channel: Channel,
    public args: string[]
  ) {
  }

  get userData () {
    return this.cachedResult!
  }

  private get userPlatformId (): string {
    return `${this.author.platform}_${this.author.id}`
  }

  static fromTelegramMessage (message: Record<string, any>, args: string[]) {
    return new Context(
      buildFromTelegramMessage(message),
      buildFromTelegramUser(message.from),
      buildFromTelegramChannel(message.chat),
      args
    )
  }

  async getUserData (): Promise<Prisma.UserGetPayload<{ select: { fmUsername: boolean; language: boolean; id: boolean }; where: any }> | null> {
    const r = await client.user.findFirst({
      where: {
        platformId: this.userPlatformId
      },
      select: {
        id: true,
        fmUsername: true,
        language: true
      }
    })

    this.cachedResult = r
    return r
  }

  createUserData (fmUsername: string, languageCode?: string) {
    const data = { fmUsername, language: languageCode }
    return client.user.upsert({
      create: {
        platformId: this.userPlatformId,
        ...data
      },
      update: data,
      where: {
        platformId: this.userPlatformId
      }
    })
  }

  reply (content: Replyable) {
    this.replyWith = content
  }
}

