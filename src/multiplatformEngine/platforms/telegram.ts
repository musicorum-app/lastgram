import { Platform } from '../platform.js'
import { debug, error, grey, warn } from '../../loggingEngine/logging.js'
import { buildFromTelegramUser, User } from '../common/user.js'
import { handleTelegramMessage } from '../utilities/telegram.js'
import { Context, MinimalContext } from '../common/context.js'
import { eventEngine } from '../../eventEngine/index.js'
import { EngineError, UnknownError } from '../../eventEngine/types/errors.js'

const API_URL = 'https://api.telegram.org/bot'

export default class Telegram extends Platform {
  bot: User

  private running = false

  constructor () {
    super('telegram')
    if (!process.env.TELEGRAM_TOKEN) {
      error('telegram.main', 'TELEGRAM_TOKEN environment variable not set')
      process.exit(1)
    }

    this.createCounter('telegram_requests', 'Telegram request count', ['success', 'method'])
  }

  getUpdates (offset?: number): Promise<void> {
    if (!this.running) return Promise.resolve()

    return this.request('getUpdates', {
      offset
    }).then(async (response: Record<string, any>) => {
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

      return this.getUpdates(offset)
    })
  }

  async handleInteraction (query: Record<string, any>) {
    debug('telegram.onInteraction', `received button interaction`)
    const [id, data] = eventEngine.extractIDFromData(query.data)
    const user = buildFromTelegramUser(query.from)
    const ctx = new MinimalContext(query.chat_instance, user, data)
    await ctx.getUserData()

    try {
      await eventEngine.dispatchEvent(id, ctx)
      await this.answerCallbackQuery(query.id, ctx.replyOptions?.alertText, ctx.replyOptions?.warning)
      if (ctx.replyWith) await this.deliverInteraction(query, ctx)
    } catch (e) {
      if (e instanceof EngineError) {
        await this.answerCallbackQuery(query.id, ctx.t(e.translationKey), true)
        if (!(e instanceof UnknownError)) return
      }
      error('telegram.onInteraction', `error while handling button interaction\n${grey(e.stack)}`)
    }
  }

  async deliverInteraction (query: Record<string, any>, ctx: MinimalContext) {
    if (ctx.replyOptions?.keepComponents === false) {
      await this.updateMessageReplyMarkup({
        chatID: query.message.chat.id,
        messageID: query.message.message_id
      }, JSON.stringify({ inline_keyboard: [] }))
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
  }

  deliverMessage (ctx: Context) {
    const id = ctx.channel?.id || ctx.author.id
    const replyTo = ctx.message.replyingTo ? ctx.message.id : undefined

    return this.sendMessage(id, ctx.replyWith!.toString(), {
      parseMode: ctx.replyMarkup === 'markdown' ? 'HTML' : undefined,
      replyTo,
      replyMarkup: ctx.components.components[0]
        ? JSON.stringify({ inline_keyboard: ctx.components.components })
        : undefined
    })
  }

  public sendMessage (chatId: string, text: string, options: { parseMode?: 'MarkdownV2' | 'HTML', replyTo?: string, replyMarkup?: string | undefined }) {
    return this.request('sendMessage', {
      chat_id: chatId,
      text,
      parse_mode: options?.parseMode,
      reply_to_message_id: options?.replyTo,
      reply_markup: options?.replyMarkup
    })
  }

  public updateMessageText (data: { messageID: number, chatID: number }, text: string, options: { parseMode?: 'MarkdownV2' | 'HTML', replyMarkup?: string | undefined }) {
    return this.request('editMessageText', {
      chat_id: data.chatID,
      message_id: data.messageID,
      text,
      parse_mode: options?.parseMode,
      reply_markup: options?.replyMarkup
    })
  }

  public updateMessageReplyMarkup (data: { messageID: number, chatID: number }, replyMarkup: string) {
    return this.request('editMessageReplyMarkup', {
      chat_id: data.chatID,
      message_id: data.messageID,
      reply_markup: replyMarkup
    })
  }

  public answerCallbackQuery (callbackQueryId: string, text?: string, showAlert?: boolean) {
    return this.request('answerCallbackQuery', {
      callback_query_id: callbackQueryId,
      text,
      show_alert: showAlert
    })
  }

  async start () {
    this.running = true
    this.bot = await this.request('getMe').then(buildFromTelegramUser)
    return this.getUpdates()
  }

  private request (method: string, data: Record<string, any> = {}) {
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
