import { buildFromDiscordMessage, buildFromTelegramMessage, Message } from './message.js'
import { buildFromDiscordChannel, buildFromTelegramChannel, Channel } from './channel.js'
import { Replyable } from '../protocols.js'
import { buildFromDiscordUser, buildFromTelegramUser, User } from './user.js'
import { client } from '@/database'

import { MinimalCommand } from '@/commands/command'
import { CommandRunner } from '@/commands'
import { ChatInputCommandInteraction } from 'discord.js'
import { lt } from '@/translations'
import { CommandComponentBuilder } from './components/builder.js'
import { GuardData } from '@/commands/guards'
import { fixLanguageFormat } from '@/commands/helpers'
import { UserCreateInput, UserGetPayload, UserSelect } from '@/prisma/models/User'

export type CachedUserData = UserGetPayload<{}>

interface ReplyOptions {
    noTranslation?: boolean
    imageURL?: string
    editOriginal?: boolean
    ephemeral?: boolean
    keepComponents?: boolean
    alertText?: string
    warning?: boolean
    sendImageAsPhoto?: boolean
    replyingToOriginal?: boolean
}

export class MinimalContext {
    replyWith?: Replyable
    replyOptions?: ReplyOptions
    public components: CommandComponentBuilder
    public replyMarkup?: string
    public command?: MinimalCommand
    public guardData: GuardData = {}
    public inlineMessageId?: string
    private currentGuard?: string

    constructor(
        public author: User,
        public interactionData?: string
    ) {
        this.components = new CommandComponentBuilder(this)
    }

    set guard(guard: string | undefined) {
        this.currentGuard = guard
    }

    get registeredUserData() {
        return this.guardData.registeredUserData as CachedUserData
    }

    get targetedUserData() {
        return this.guardData.targetedUserData as CachedUserData
    }

    get targetedUser() {
        return this.guardData.targetedUser as User
    }

    get registeredUser() {
        return this.guardData.registeredUser as User
    }

    get language() {
        return this.registeredUserData?.language || fixLanguageFormat(this.author.languageCode) || 'en'
    }

    setGuardData(key: keyof GuardData, data: any) {
        this.guardData[key] = data
    }

    async getUserData(user: User | undefined, guardKey: keyof GuardData): Promise<CachedUserData | null> {
        const targetUser = user || this.author
        let r = await client.user.findFirst({
            where: {
                platformId: this.userPlatformId(targetUser)
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
    async createUserData(fmUsername: string, languageCode?: string, user = this.author) {
        // we need to upsert the LastFmUser model with the username, and then link it to the user.
        await client.lastFmUser.upsert({
            create: {
                fmUsername,
            },
            update: {
                fmUsername,
            },
            where: {
                fmUsername
            }
        })

        const data = {
            lastFmUsername: fmUsername,
            language: languageCode,
            displayName: user.name
        }
        return client.user.upsert({
            create: {
                platformId: this.userPlatformId(user),
                ...data,
            },
            update: data,
            where: {
                platformId: this.userPlatformId(user)
            }
        })
    }

    t(translationKey: string, data: Record<string, any> = {}) {
        return lt(this.language, translationKey, data)
    }

    reply(translationKey: string, data: Record<string, any> = {}, options: ReplyOptions = {}) {
        this.replyWith = options.noTranslation ? translationKey : this.t(translationKey, data).trim()

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
                this.replyWith = (this.replyWith as string)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/(?<!\\)\*\*(.*?)(?<!\\)\*\*/g, '<b>$1</b>')
                    .replace(/(?<!\\)\*(.*?)(?<!\\)\*/g, '<i>$1</i>')
                    .replace(/(?<!\\)`(.*?)(?<!\\)`/g, '<code>$1</code>')
                    .replace(/(?<!\\)\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
                    .replace(/\\([*_`~\[\]])/g, '$1')
            }
        }

        this.replyOptions = options
    }

    setCommand(command: MinimalCommand) {
        this.command = command
    }

    public userPlatformId(user = this.author): string {
        return `${user.platform}_${user.id}`
    }
}

export class Context extends MinimalContext {
    constructor(
        public message: Message,
        public author: User,
        public channel: Channel,
        public args: string[],
        public runner: CommandRunner
    ) {
        super(author)
    }

    static fromDiscordMessage(message: ChatInputCommandInteraction, args: string[], runner: CommandRunner) {
        return new Context(
            buildFromDiscordMessage(message),
            buildFromDiscordUser(message.user),
            buildFromDiscordChannel(message.channel),
            args,
            runner
        )
    }

    static fromTelegramMessage(message: Record<string, any>, args: string[], runner: CommandRunner) {
        return new Context(
            buildFromTelegramMessage(message),
            buildFromTelegramUser(message.from),
            buildFromTelegramChannel(message.chat),
            args,
            runner
        )
    }

    static fromTelegramInlineResult(inlineQuery: Record<string, any>, args: string[], runner: CommandRunner) {
        const ctx = new Context(
            { id: inlineQuery.inline_message_id, text: '' } as unknown as Message,
            buildFromTelegramUser(inlineQuery.from),
            { id: inlineQuery.from.id.toString(), type: 'private', username: inlineQuery.from.username } as unknown as Channel,
            args,
            runner
        )
        ctx.inlineMessageId = inlineQuery.inline_message_id
        return ctx
    }
}

