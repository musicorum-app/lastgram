import { buildFromTelegramMessage, Message } from './message.js'
import { buildFromTelegramChannel, Channel } from './channel.js'
import { Replyable } from '../protocols.js'
import { buildFromTelegramUser, User } from './user.js'
import { client } from '../../database.js'
import { Prisma } from '@prisma/client'
import { client as i18n } from '../../translationEngine/index.js'
import { marked } from 'marked'
import { Command } from '../../commandEngine/command.js'
import { CommandRunner } from '../../commandEngine/index.js'

export type CachedUserData = Prisma.UserGetPayload<{ select: { fmUsername: boolean; language: boolean; id: boolean }; where: any }>

interface ReplyOptions {
  noTranslation?: boolean
}

export class Context {
  replyWith?: Replyable
  private cachedResult: CachedUserData | null
  public replyMarkup?: string
  public command?: Command

  constructor (
    public message: Message,
    public author: User,
    public channel: Channel,
    public args: string[],
    public runner: CommandRunner
  ) {
  }

  get userData () {
    return this.cachedResult!
  }

  get language () {
    return this.userData?.language || this.author.languageCode || 'en'
  }

  async getUserData (user = this.author): Promise<Prisma.UserGetPayload<{ select: { fmUsername: boolean; language: boolean; id: boolean }; where: any }> | null> {
    const r = await client.user.findFirst({
      where: {
        platformId: this.userPlatformId(user)
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

  static fromTelegramMessage (message: Record<string, any>, args: string[], runner: CommandRunner) {
    return new Context(
      buildFromTelegramMessage(message),
      buildFromTelegramUser(message.from),
      buildFromTelegramChannel(message.chat),
      args,
      runner
    )
  }

  /**
   * Creates or updates user data.
   * > ⚠ **WARNING**
   * > This method uses `Context.userPlatformId`.
   */
  createUserData (fmUsername: string, languageCode?: string, user = this.author) {
    const data = { fmUsername, language: languageCode }
    return client.user.upsert({
      create: {
        platformId: this.userPlatformId(user),
        ...data
      },
      update: data,
      where: {
        platformId: this.userPlatformId(user)
      }
    })
  }

  private userPlatformId (user = this.author): string {
    return `${user.platform}_${user.id}`
  }

  setCommand (command: Command) {
    this.command = command
  }

  t (translationKey: string, data: Record<string, any> = {}) {
    return i18n.__({
      phrase: translationKey,
      locale: this.language
    }, data)
  }

  reply (translationKey: string, data: Record<string, any> = {}, options: ReplyOptions = {}) {
    this.replyWith = (options.noTranslation || data.noTranslation) ? translationKey : i18n.__({
      phrase: translationKey,
      locale: this.language
    }, data)

    // detect markdown
    const hasMarkdown = (this.replyWith as string).includes('*') || (this.replyWith as string).includes('_') || (this.replyWith as string).includes('`')
    if (hasMarkdown) this.replyMarkup = 'markdown'
    if (hasMarkdown && this.message.platform === 'telegram') {
      this.replyWith = marked.parseInline(this.replyWith as string)
    }
  }
}

