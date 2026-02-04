import { Platform } from '../platform.js'
import { debug, error, grey, info, warn } from '@/logging/logging'
import { buildFromTelegramUser, User } from '../common/user.js'
import { handleTelegramMessage } from '../utilities/telegram.js'
import { Context, MinimalContext } from '../common/context.js'
import { eventEngine } from '@/event'
import { EngineError } from '@/event/types/errors'

const API_URL = 'https://api.telegram.org/bot'

export default class Telegram extends Platform {
    bot: User

    private running = false

    constructor() {
        super('telegram')
        if (!process.env.TELEGRAM_TOKEN) {
            error('telegram.main', 'TELEGRAM_TOKEN environment variable not set')
            process.exit(1)
        }

        this.createCounter('telegram_requests', 'Telegram request count', ['success', 'method'])
    }

    async getUpdates(offset?: number): Promise<void> {
        if (!this.running) return Promise.resolve()

        const response = await this.request('getUpdates', {
            offset,
            drop_pending_updates: process.env.DROP_PENDING_UPDATES_ON_START === 'true'
        })
        // set drop pending updates to false now.
        process.env.DROP_PENDING_UPDATES_ON_START = 'false'
        if (!(response instanceof Array)) {
            warn('platforms.telegram', 'getUpdates did not return an array. waiting 1 second before trying again...')
            await new Promise(resolve => setTimeout(resolve, 1000))
            return this.getUpdates(offset)
        }
        this.incrementMessages(response.length)
        for (const update of response) {
            if (update.update_id >= (offset || 0)) {
                offset = update.update_id + 1
            }

            if (update.message && update.message.text) {
                handleTelegramMessage(this.bot.username!, update.message)?.then?.((ctx) => {
                    if (ctx?.replyWith) return this.deliverMessage(ctx)
                    return undefined
                })
            }

            if (update.callback_query) {
                this.handleInteraction(update.callback_query).then(a => a)
            }
        }
        return await this.getUpdates(offset)
    }

    async handleInteraction(query: Record<string, any>) {
        debug('telegram.onInteraction', `received button interaction`)
        const [id, data] = eventEngine.extractIDFromData(query.data)
        const user = buildFromTelegramUser(query.from)
        const ctx = new MinimalContext(user, data)
        await ctx.getUserData(undefined, 'registeredUserData')

        try {
            await eventEngine.dispatchEvent(id, ctx)
            await this.answerCallbackQuery(query.id, ctx.replyOptions?.alertText, ctx.replyOptions?.warning)
            if (ctx.replyWith) await this.deliverInteraction(query, ctx)
        } catch (e) {
            if (e instanceof EngineError) {
                await this.answerCallbackQuery(query.id, ctx.t(e.translationKey), true)
                return
            }
            error('telegram.onInteraction', `error while handling button interaction\n${grey(e.stack)}`)
        }
    }

    async deliverInteraction(query: Record<string, any>, ctx: MinimalContext) {
        await this.clearInteractions(query)
        if (ctx.replyOptions?.imageURL && ctx.replyOptions?.sendImageAsPhoto) {
            await this.updateMessageMedia({
                chatID: query.message.chat.id,
                messageID: query.message.message_id
            }, {
                url: ctx.replyOptions.imageURL,
                caption: ctx.replyWith!.toString()
            }, {
                parseMode: ctx.replyMarkup === 'markdown' ? 'HTML' : undefined
            })

            await this.updateInteraction(query, ctx)
            return
        }

        if (ctx.replyOptions?.editOriginal === false) {
            await this.sendMessage(query.message.chat.id, ctx.replyWith!.toString(), {
                parseMode: ctx.replyMarkup === 'markdown' ? 'HTML' : undefined,
                replyTo: query.message.message_id
            })
        } else {
            await this.updateMessageText({
                chatID: query.message.chat.id,
                messageID: query.message.message_id
            }, ctx.replyWith!.toString(), {
                parseMode: ctx.replyMarkup === 'markdown' ? 'HTML' : undefined
            })
        }

        await this.updateInteraction(query, ctx)
    }

    deliverMessage(ctx: Context) {
        const id = ctx.channel?.id || ctx.author.id
        const basedReply = ctx.message.id
        const replyTo = ctx.message.replyingTo ? ctx.message.id : basedReply

        if (ctx.replyOptions?.sendImageAsPhoto) {

            return this.sendPhoto(id, { url: ctx.replyOptions!.imageURL!, caption: ctx.replyWith!.toString() }, {
                replyTo,
                parseMode: ctx.replyMarkup === 'markdown' ? 'HTML' : undefined,
                replyMarkup: ctx.components.components[0]
                    ? JSON.stringify({ inline_keyboard: ctx.components.components })
                    : undefined,
                showCaptionBelowMedia: true
            })
        }

        return this.sendMessage(id, ctx.replyWith!.toString(), {
            parseMode: ctx.replyMarkup === 'markdown' ? 'HTML' : undefined,
            replyTo,
            replyMarkup: ctx.components.components[0]
                ? JSON.stringify({ inline_keyboard: ctx.components.components })
                : undefined
        })
    }

    updateMessageMedia(data: { messageID: number, chatID: number }, media: { url: string, caption?: string }, options: {
        parseMode?: 'MarkdownV2' | 'HTML'
    }) {
        return this.request('editMessageMedia', {
            chat_id: data.chatID,
            message_id: data.messageID,
            media: {
                type: 'photo',
                media: media.url,
                caption: media.caption,
                parse_mode: options?.parseMode
            }
        })
    }

    sendPhoto(chatId: string, photo: { url: string, caption?: string }, options: {
        showCaptionBelowMedia?: boolean
        replyTo?: string, replyMarkup?: string | undefined, parseMode?: 'MarkdownV2' | 'HTML'
    }) {
        return this.request('sendPhoto', {
            chat_id: chatId,
            photo: photo.url,
            caption: photo.caption,
            reply_to_message_id: options?.replyTo,
            reply_markup: options?.replyMarkup,
            parse_mode: options?.parseMode,
            show_caption_above_media: !options?.showCaptionBelowMedia
        })
    }

    public sendMessage(chatId: string, text: string, options: {
        parseMode?: 'MarkdownV2' | 'HTML',
        replyTo?: string,
        replyMarkup?: string | undefined
    }) {
        return this.request('sendMessage', {
            chat_id: chatId,
            text,
            parse_mode: options?.parseMode,
            reply_to_message_id: options?.replyTo,
            reply_markup: options?.replyMarkup
        })
    }

    public updateMessageText(data: { messageID: number, chatID: number }, text: string, options: {
        parseMode?: 'MarkdownV2' | 'HTML',
        replyMarkup?: string | undefined
    }) {
        return this.request('editMessageText', {
            chat_id: data.chatID,
            message_id: data.messageID,
            text,
            parse_mode: options?.parseMode,
            reply_markup: options?.replyMarkup
        })
    }

    public updateMessageReplyMarkup(data: { messageID: number, chatID: number }, replyMarkup: string) {
        return this.request('editMessageReplyMarkup', {
            chat_id: data.chatID,
            message_id: data.messageID,
            reply_markup: replyMarkup
        })
    }

    public answerCallbackQuery(callbackQueryId: string, text?: string, showAlert?: boolean) {
        return this.request('answerCallbackQuery', {
            callback_query_id: callbackQueryId,
            text,
            show_alert: showAlert
        })
    }

    async start() {
        this.running = true
        this.bot = await this.request('getMe').then(buildFromTelegramUser)
        info('telegram.start', `running as @${this.bot.username}`)
        return this.getUpdates()
    }

    private async clearInteractions(query: Record<string, any>) {
        await this.updateMessageReplyMarkup({
            chatID: query.message.chat.id,
            messageID: query.message.message_id
        }, JSON.stringify({
            inline_keyboard: []
        }))
    }

    private async updateInteraction(query: Record<string, any>, ctx: MinimalContext) {
        if (ctx.components.components[0]) {
            await this.updateMessageReplyMarkup({
                chatID: query.message.chat.id,
                messageID: query.message.message_id
            }, JSON.stringify({
                inline_keyboard: ctx.replyOptions?.keepComponents === false ? [] : ctx.components.components
            }))
        }
    }

    private request(method: string, data: Record<string, any> = {}) {
        return fetch(`${API_URL}${process.env.TELEGRAM_TOKEN}/${method}`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json()).then(response => {
            this.getCounter('telegram_requests').inc({
                success: response.ok ? 'true' : 'false',
                method
            })

            if (!response.ok && !response.description?.includes?.('rights')) {
                warn('platforms.telegram', `The Telegram API returned an error: ${response.description}`)
                return undefined
            }

            return response.result
        }).catch((e) => {
            error('platforms.telegram', `A possible networking error has occurred.\n${grey(e.stack)}`)
        })
    }
}
