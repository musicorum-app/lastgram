import { Platform } from '../platform.js'
import { error, warn } from '../../loggingEngine/logging.js'
import { buildFromTelegramUser, User } from '../common/user.js'
import { handleTelegramMessage } from '../utilities/telegram.js'
import { Context } from '../common/context.js'
import { Replyable } from '../protocols.js'

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
    console.log('done')
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
            if (ctx?.replyWith) return this.deliverMessage(ctx, ctx.replyWith)
          })
        }
      }

      return this.getUpdates(offset)
    })
  }

  deliverMessage (ctx: Context, text: Replyable) {
    const id = ctx.channel?.id || ctx.author.id
    const replyTo = ctx.message.replyingTo ? ctx.message.id : undefined
    return this.sendMessage(id, text.toString(), {
      parseMode: ctx.replyMarkup === 'markdown' ? 'HTML' : undefined,
      replyTo
    })
  }

  public sendMessage (chatId: string, text: string, options: { parseMode?: 'MarkdownV2' | 'HTML', replyTo?: string }) {
    return this.request('sendMessage', {
      chat_id: chatId,
      text,
      parse_mode: options?.parseMode,
      reply_to_message_id: options?.replyTo
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
      // TODO: turn this counter onto a histogram 
      this.getCounter('telegram_requests').inc({
        success: response.ok ? 'true' : 'false',
        method
      })

      if (!response.ok) {
        warn('platforms.telegram', `The Telegram API returned an error: ${response.description}`)
      }

      return response.result
    })
  }
}