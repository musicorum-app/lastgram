import { Platform } from '../platform.js'
import { debug, error, grey, info, warn } from '@/logging/logging'
import { buildFromTelegramUser, User } from '../common/user.js'
import { handleTelegramMessage } from '../utilities/telegram.js'
import { Context, MinimalContext } from '../common/context.js'
import { eventEngine } from '@/event'
import { EngineError } from '@/event/types/errors'
import { commandRunner } from '@/commands'
import { client } from '@/database'
import { lt } from '@/translations'
import { getRecentTracks } from '@/fm/epistolares'

const API_URL = 'https://api.telegram.org/bot'

const buildInlineResult = (id: string, title: string, description: string, caption: string, photo: string | undefined) => {
    if (photo) {
        return {
            type: 'photo',
            id,
            photo_url: photo,
            thumbnail_url: photo,
            title,
            description,
            caption,
            parse_mode: 'HTML'
        }
    } else {
        return {
            type: 'article',
            id,
            title,
            description,
            input_message_content: {
                message_text: caption,
                parse_mode: 'HTML'
            }
        }
    }
}

export default class Telegram extends Platform {
    bot: User | undefined
    private running = false

    constructor() {
        super('telegram')
        if (!process.env.TELEGRAM_TOKEN) {
            error('telegram.main', 'TELEGRAM_TOKEN environment variable not set')
            process.exit(1)
        }

        this.createCounter('telegram_requests', 'Telegram request count', ['success', 'method'])
    }

    async getUpdates(initialOffset?: number): Promise<void> {
        let offset = initialOffset;

        while (this.running) {
            const response = await this.request('getUpdates', {
                offset,
                drop_pending_updates: process.env.DROP_PENDING_UPDATES_ON_START === 'true'
            })
            // set drop pending updates to false now.
            process.env.DROP_PENDING_UPDATES_ON_START = 'false'
            if (!(response instanceof Array)) {
                warn('platforms.telegram', 'getUpdates did not return an array. waiting 1 second before trying again...')
                await new Promise(resolve => setTimeout(resolve, 1000))
                continue
            }
            for (const update of response) {
                if (update.update_id >= (offset || 0)) {
                    offset = update.update_id + 1
                }
                this.processUpdate(update)
            }
        }
    }

    async processUpdate(update: Record<string, any>) {
        this.incrementMessages(1)
        if (update.inline_query) {
            this.handleInlineQuery(update.inline_query).catch(e => error('telegram.processUpdate', e.stack))
        }

        if (update.chosen_inline_result) {
            this.handleChosenInlineResult(update.chosen_inline_result).catch(e => error('telegram.processUpdate', e.stack))
        }

        if (update.message && update.message.text) {
            handleTelegramMessage(this.bot!.username!, update.message)?.then?.((ctx) => {
                if (ctx?.replyWith) return this.deliverMessage(ctx)
                return undefined
            }).catch(e => error('telegram.processUpdate', e.stack))
        }

        if (update.callback_query) {
            this.handleInteraction(update.callback_query).catch(e => error('telegram.processUpdate', e.stack))
        }
    }

    async handleInlineQuery(inlineQuery: Record<string, any>) {
        debug('telegram.onInlineQuery', `received inline query from ${inlineQuery.from.id}`)
        const user = buildFromTelegramUser(inlineQuery.from)
        const platformId = `telegram_${user.id}`
        const dbUser = await client.user.findFirst({ where: { platformId } })

        if (!dbUser || !dbUser.lastFmUsername) {
            debug('telegram.onInlineQuery', `user not registered, returning article`)
            const results = [{
                type: 'article',
                id: 'not_registered',
                title: 'Not Registered',
                description: 'You need to register your Last.fm account to use this bot.',
                input_message_content: { message_text: 'I tried to use the @lastgrambot, but I am not registered yet!' }
            }]
            await this.request('answerInlineQuery', {
                inline_query_id: inlineQuery.id,
                results: JSON.stringify(results),
                cache_time: 0
            })
            return
        }

        let trackMe: any = null
        let albumMe: any = null
        let artistMe: any = null
        try {
            const me = await getRecentTracks(dbUser.lastFmUsername, 1).then(r => r?.[0])
            if (me) {
                trackMe = {
                    name: me.track.name,
                    artist: me.artist.name,
                    album: me.album?.name || '',
                    playCount: me.track.userScrobbles?.playCount || 0,
                    loved: me.track.userScrobbles?.loved || false,
                    isNowPlaying: me.nowPlaying,
                    imageURL: me.track?.cover?.defaultURL || me.album?.cover?.defaultURL || me.artist?.cover?.defaultURL,
                }
                albumMe = {
                    artist: me.artist.name,
                    album: me.album?.name || '',
                    playCount: me.album?.userScrobbles?.playCount || 0,
                    isNowPlaying: me.nowPlaying,
                    imageURL: me.album?.cover?.defaultURL || me.artist?.cover?.defaultURL,
                }
                artistMe = {
                    artist: me.artist.name,
                    playCount: me.artist.userScrobbles?.playCount || 0,
                    isNowPlaying: me.nowPlaying,
                    imageURL: me.artist?.cover?.defaultURL,
                }
            }
        } catch (e: any) {
            error('telegram.onInlineQuery', `error fetching tracks: ${e.stack}`)
        }

        if (!trackMe) {
            debug('telegram.onInlineQuery', `no recent tracks found for ${dbUser.lastFmUsername}, returning article`)
            const results = [{
                type: 'article',
                id: 'no_tracks',
                title: 'No Recent Tracks',
                description: 'You have no recent scrobbles.',
                input_message_content: { message_text: 'I have no recent scrobbles on Last.fm!' }
            }]
            await this.request('answerInlineQuery', {
                inline_query_id: inlineQuery.id,
                results: JSON.stringify(results),
                cache_time: 0
            })
            return
        }

        const trackPhoto = trackMe.imageURL?.replaceAll('300x300', '1000x1000')
        const albumPhoto = albumMe.imageURL?.replaceAll('300x300', '1000x1000')
        const artistPhoto = artistMe.imageURL?.replaceAll('300x300', '1000x1000')

        const lang = dbUser.language || 'en'
        const userDisplayName = inlineQuery.from.first_name || inlineQuery.from.username || dbUser.lastFmUsername

        const formatTelegramHTML = (text: string) => {
            return text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
                .replace(/\*(.*?)\*/g, '<i>$1</i>')
                .replace(/`(.*?)`/g, '<code>$1</code>')
                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
        }

        const trackCaptionRaw = lt(lang, 'commands:listening', {
            user: userDisplayName,
            artistCrown: '🧑‍🎤',
            isListening: trackMe.isNowPlaying ? 'isPlaying' : 'wasPlaying',
            track: trackMe.name,
            artist: trackMe.artist,
            album: trackMe.album,
            playCount: trackMe.playCount || 0,
            emoji: trackMe.loved ? dbUser.likedEmoji || '❤️' : '🎵',
            tags: '',
            joinArrays: '\n'
        }).trim()
        const trackCaption = formatTelegramHTML(trackCaptionRaw)

        const albumCaptionRaw = lt(lang, 'commands:album', {
            user: userDisplayName,
            artistCrown: '🧑‍🎤',
            isListening: albumMe.isNowPlaying ? 'isPlaying' : 'wasPlaying',
            artist: albumMe.artist,
            album: albumMe.album,
            playCount: albumMe.playCount || 0,
            tags: '',
            joinArrays: '\n'
        }).trim()
        const albumCaption = formatTelegramHTML(albumCaptionRaw)

        const artistCaptionRaw = lt(lang, 'commands:artist', {
            user: userDisplayName,
            artistCrown: '🧑‍🎤',
            isListening: artistMe.isNowPlaying ? 'isPlaying' : 'wasPlaying',
            artist: artistMe.artist,
            playCount: artistMe.playCount || 0,
            tags: '',
            joinArrays: '\n'
        }).trim()
        const artistCaption = formatTelegramHTML(artistCaptionRaw)

        const results = [
            buildInlineResult('listening', 'Current Track', 'Share your now playing track', trackCaption, trackPhoto),
            buildInlineResult('album', 'Current Album', 'Share your now playing album', albumCaption, albumPhoto),
            buildInlineResult('artist', 'Current Artist', 'Share your now playing artist', artistCaption, artistPhoto)
        ]

        debug('telegram.onInlineQuery', `answering inline query for ${inlineQuery.from.id}`)
        const response = await this.request('answerInlineQuery', {
            inline_query_id: inlineQuery.id,
            results: JSON.stringify(results),
            cache_time: 5
        })
        debug('telegram.onInlineQuery', `answerInlineQuery response: ${JSON.stringify(response)}`)
    }

    async handleChosenInlineResult(chosenResult: Record<string, any>) {
        debug('telegram.onChosenInlineResult', `received chosen inline result ${chosenResult.result_id} from ${chosenResult.from.id}`)
        if (!chosenResult.inline_message_id) return

        const parts = chosenResult.result_id.split(' ')
        const commandName = parts[0]
        const args = parts.slice(1)

        const ctx = Context.fromTelegramInlineResult(chosenResult, args, commandRunner)
        ctx.setCommand({ name: commandName, protectionLevel: 'unknown' })

        await commandRunner.runCommand(commandName, ctx)

        if (ctx.replyWith) {
            await this.deliverMessage(ctx)
        }
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
            error('telegram.onInteraction', `error while handling button interaction\n${grey((e as Error).stack!)}`)
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

    async deliverMessage(ctx: Context) {
        if (ctx.inlineMessageId) {
            if (ctx.replyOptions?.imageURL) {
                let res = await this.updateMessageMedia({
                    inlineMessageId: ctx.inlineMessageId
                }, {
                    url: ctx.replyOptions.imageURL,
                    caption: ctx.replyWith!.toString()
                }, {
                    parseMode: ctx.replyMarkup === 'markdown' ? 'HTML' : undefined
                })
                
                if (!res) {
                    const bypassedUrl = ctx.replyOptions.imageURL.includes('?')
                        ? `${ctx.replyOptions.imageURL}&id=${Bun.randomUUIDv7()}`
                        : `${ctx.replyOptions.imageURL}?id=${Bun.randomUUIDv7()}`
                        
                    res = await this.updateMessageMedia({
                        inlineMessageId: ctx.inlineMessageId
                    }, {
                        url: bypassedUrl,
                        caption: ctx.replyWith!.toString()
                    }, {
                        parseMode: ctx.replyMarkup === 'markdown' ? 'HTML' : undefined
                    })
                }
                
                if (res) return res
            }

            return this.updateMessageCaption({
                inlineMessageId: ctx.inlineMessageId
            }, ctx.replyWith!.toString(), {
                parseMode: ctx.replyMarkup === 'markdown' ? 'HTML' : undefined,
                replyMarkup: ctx.components.components[0]
                    ? JSON.stringify({ inline_keyboard: ctx.components.components })
                    : undefined
            })
        }

        const id = ctx.channel?.id || ctx.author.id
        const basedReply = ctx.message.id
        const replyTo = ctx.message.replyingTo ? ctx.message.id : basedReply

        if (ctx.replyOptions?.sendImageAsPhoto && ctx.replyOptions.imageURL) {
            let res = await this.sendPhoto(id, { url: ctx.replyOptions!.imageURL!, caption: ctx.replyWith!.toString() }, {
                replyTo,
                parseMode: ctx.replyMarkup === 'markdown' ? 'HTML' : undefined,
                replyMarkup: ctx.components.components[0]
                    ? JSON.stringify({ inline_keyboard: ctx.components.components })
                    : undefined,
                showCaptionBelowMedia: true
            })
            
            if (!res) {
                const bypassedUrl = ctx.replyOptions.imageURL.includes('?')
                    ? `${ctx.replyOptions.imageURL}&id=${Bun.randomUUIDv7()}`
                    : `${ctx.replyOptions.imageURL}?id=${Bun.randomUUIDv7()}`
                    
                res = await this.sendPhoto(id, { url: bypassedUrl, caption: ctx.replyWith!.toString() }, {
                    replyTo,
                    parseMode: ctx.replyMarkup === 'markdown' ? 'HTML' : undefined,
                    replyMarkup: ctx.components.components[0]
                        ? JSON.stringify({ inline_keyboard: ctx.components.components })
                        : undefined,
                    showCaptionBelowMedia: true
                })
            }
            
            if (res) return res
        }

        return this.sendMessage(id, ctx.replyWith!.toString(), {
            parseMode: ctx.replyMarkup === 'markdown' ? 'HTML' : undefined,
            replyTo,
            replyMarkup: ctx.components.components[0]
                ? JSON.stringify({ inline_keyboard: ctx.components.components })
                : undefined
        })
    }

    updateMessageMedia(data: { messageID?: number, chatID?: number, inlineMessageId?: string }, media: { url: string, caption?: string }, options: {
        parseMode?: 'MarkdownV2' | 'HTML'
    }) {
        return this.request('editMessageMedia', {
            chat_id: data.chatID,
            message_id: data.messageID,
            inline_message_id: data.inlineMessageId,
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

    public updateMessageText(data: { messageID?: number, chatID?: number, inlineMessageId?: string }, text: string, options: {
        parseMode?: 'MarkdownV2' | 'HTML',
        replyMarkup?: string | undefined
    }) {
        return this.request('editMessageText', {
            chat_id: data.chatID,
            message_id: data.messageID,
            inline_message_id: data.inlineMessageId,
            text,
            parse_mode: options?.parseMode,
            reply_markup: options?.replyMarkup
        })
    }

    public updateMessageCaption(data: { messageID?: number, chatID?: number, inlineMessageId?: string }, caption: string, options: {
        parseMode?: 'MarkdownV2' | 'HTML',
        replyMarkup?: string | undefined
    }) {
        return this.request('editMessageCaption', {
            chat_id: data.chatID,
            message_id: data.messageID,
            inline_message_id: data.inlineMessageId,
            caption,
            parse_mode: options?.parseMode,
            reply_markup: options?.replyMarkup
        })
    }

    public updateMessageReplyMarkup(data: { messageID?: number, chatID?: number, inlineMessageId?: string }, replyMarkup: string) {
        return this.request('editMessageReplyMarkup', {
            chat_id: data.chatID,
            message_id: data.messageID,
            inline_message_id: data.inlineMessageId,
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
        info('telegram.start', `running as @${this.bot!.username}`)

        const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL
        if (webhookUrl) {
            const secretPath = process.env.WEBHOOK_SECRET_PATH
            if (!secretPath) {
                error('telegram.start', 'WEBHOOK_SECRET_PATH is required when using webhooks!')
                process.exit(1)
            }
            const baseUrl = webhookUrl.replace(/\/$/, '')
            const fullWebhookUrl = `${baseUrl}/${secretPath}`
            info('telegram.start', `Running in webhook mode for ${fullWebhookUrl} (auto setWebhook disabled)`)
        } else {
            await this.request('deleteWebhook', {})
            return this.getUpdates()
        }
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
