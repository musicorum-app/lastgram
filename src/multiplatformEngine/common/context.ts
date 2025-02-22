import { buildFromDiscordMessage, buildFromTelegramMessage, Message } from './message.js'
import { buildFromDiscordChannel, buildFromTelegramChannel, Channel } from './channel.js'
import { Replyable } from '../protocols.js'
import { buildFromDiscordUser, buildFromTelegramUser, User } from './user.js'
import { client } from '../../databaseEngine/index.js'
import { Prisma } from '@prisma/client'
import { marked } from 'marked'
import { MinimalCommand } from '../../commandEngine/command.js'
import { CommandRunner } from '../../commandEngine/index.js'
import { ChatInputCommandInteraction } from 'discord.js'
import { lt } from '../../translationEngine/index.js'
import { CommandComponentBuilder } from './components/builder.js'
import { GuardData } from '../../commandEngine/guards.js'
import { fixLanguageFormat } from '../../commandEngine/helpers.js'

export type CachedUserData = Prisma.UserGetPayload<{ select: { fmUsername: boolean; language: boolean; id: boolean, revealUser: boolean, isBanned: boolean, sessionKey: boolean }; where: any }>

interface ReplyOptions {
  noTranslation?: boolean
  imageURL?: string
  editOriginal?: boolean
  ephemeral?: boolean
  keepComponents?: boolean
  alertText?: string
  warning?: boolean
  sendImageAsPhoto?: boolean
}

export class MinimalContext {
  replyWith?: Replyable
  replyOptions?: ReplyOptions
  public components: CommandComponentBuilder
  public replyMarkup?: string
  public command?: MinimalCommand
  public guardData: GuardData = {}
  private currentGuard?: string

  constructor (
    public author: User,
    public interactionData?: string
  ) {
    this.components = new CommandComponentBuilder(this)
  }

  set guard (guard: string | undefined) {
    this.currentGuard = guard
  }

  get registeredUserData () {
    return this.guardData.registeredUserData as CachedUserData
  }

  get targetedUserData () {
    return this.guardData.targetedUserData as CachedUserData
  }

  get targetedUser () {
    return this.guardData.targetedUser as User
  }

  get registeredUser () {
    return this.guardData.registeredUser as User
  }

  get language () {
    return this.registeredUserData?.language || fixLanguageFormat(this.author.languageCode) || 'en'
  }

  setGuardData (key: keyof GuardData, data: any) {
    this.guardData[key] = data
  }

  async getUserData (user: User | undefined, guardKey: keyof GuardData): Promise<CachedUserData | null> {
    const r = await client.user.findFirst({
      where: {
        platformId: this.userPlatformId(user || this.author)
      }
    })

    this.setGuardData(guardKey, r)
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
    this.replyWith = options.noTranslation ? translationKey : this.t(translationKey, data)

    // detect markdown
    let hasMarkdown = (this.replyWith as string).includes('*') || (this.replyWith as string).includes('`') || (this.replyWith as string).includes('[')
    if (options.imageURL && this.author.platform === 'telegram' && !options.sendImageAsPhoto) {
      this.replyWith += `[\u200B](${options.imageURL})`
      hasMarkdown = true
    }

    if (options.sendImageAsPhoto && options.imageURL) {
      options.imageURL = options.imageURL.replaceAll('300x300', '1000x1000')
    }

    if (hasMarkdown) {
      this.replyMarkup = 'markdown'
      if (this.author.platform === 'telegram') {
        this.replyWith = marked.parseInline(this.replyWith as string)
      }
    }

    this.replyOptions = options
  }

  setCommand (command: MinimalCommand) {
    this.command = command
  }

  public userPlatformId (user = this.author): string {
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
    super(author)
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
}

