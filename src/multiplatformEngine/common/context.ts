import { buildFromDiscordMessage, buildFromTelegramMessage, Message } from './message.js'
import { buildFromDiscordChannel, buildFromTelegramChannel, Channel } from './channel.js'
import { Replyable } from '../protocols.js'
import { buildFromDiscordUser, buildFromTelegramUser, User } from './user.js'
import { client } from '../../database.js'
import { Prisma } from '@prisma/client'
import { marked } from 'marked'
import { Command } from '../../commandEngine/command.js'
import { CommandRunner } from '../../commandEngine/index.js'
import { ChatInputCommandInteraction } from 'discord.js'
import { lt } from '../../translationEngine/index.js'
import { CommandComponentBuilder } from './components/builder.js'

export type CachedUserData = Prisma.UserGetPayload<{ select: { fmUsername: boolean; language: boolean; id: boolean, revealUser: boolean, isBanned: boolean }; where: any }>

interface ReplyOptions {
  noTranslation?: boolean
  imageURL?: string
  editOriginal?: boolean
  ephemeral?: boolean
  keepComponents?: boolean
  alertText?: string
  warning?: boolean
}

export class MinimalContext {
  replyWith?: Replyable
  replyOptions?: ReplyOptions
  public components: CommandComponentBuilder
  public replyMarkup?: string
  protected cachedResult: CachedUserData | null
  public command?: Command
  public targetedUser?: User

  constructor (
    public channelID: string,
    public author: User,
    public interactionData?: string
  ) {
    this.components = new CommandComponentBuilder(this)
  }

  get userData () {
    return this.cachedResult!
  }

  get language () {
    return this.userData?.language || this.author.languageCode || 'en'
  }

  async getUserData (user = this.author): Promise<CachedUserData | null> {
    const r = await client.user.findFirst({
      where: {
        platformId: this.userPlatformId(user)
      },
      select: {
        id: true,
        fmUsername: true,
        language: true,
        isBanned: true,
        revealUser: true
      }
    })

    this.cachedResult = r
    return r
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

  t (translationKey: string, data: Record<string, any> = {}) {
    return lt(this.language, translationKey, data)
  }

  reply (translationKey: string, data: Record<string, any> = {}, options: ReplyOptions = {}) {
    this.replyWith = (options.noTranslation || data.noTranslation) ? translationKey : this.t(translationKey, data)

    // detect markdown
    const hasMarkdown = (this.replyWith as string).includes('*') || (this.replyWith as string).includes('`') || (this.replyWith as string).includes('[')
    if (hasMarkdown) this.replyMarkup = 'markdown'
    if (hasMarkdown && this.author.platform === 'telegram') {
      const url = options.imageURL ? `[\u200B](${options.imageURL})` : ''
      this.replyWith = marked.parseInline(this.replyWith as string + url)
    }

    this.replyOptions = options
  }

  private userPlatformId (user = this.author): string {
    return `${user.platform}_${user.id}`
  }
}

export class Context extends MinimalContext {
  constructor (
    public message: Message,
    public author: User,
    public channel: Channel,
    public args: string[],
    public runner: CommandRunner
  ) {
    super(channel.id, author)
  }

  static fromDiscordMessage (message: ChatInputCommandInteraction, args: string[], runner: CommandRunner) {
    return new Context(
      buildFromDiscordMessage(message),
      buildFromDiscordUser(message.user),
      buildFromDiscordChannel(message.channel),
      args,
      runner
    )
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

  setCommand (command: Command) {
    this.command = command
  }
}

