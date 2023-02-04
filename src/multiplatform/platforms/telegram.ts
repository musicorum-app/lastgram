import { Platform } from '../platform.js'
import { warn } from '../../loggingEngine/logging.js'
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
      throw new Error('TELEGRAM_TOKEN environment variable not set')
    }

    this.createCounter('telegram_requests', 'Telegram request count', ['success', 'method'])
  }

  getUpdates (offset?: number): Promise<void> {
    if (!this.running) return Promise.resolve()

    return this.request('getUpdates', {
      offset
    }).then(async (response: Record<string, any>) => {
      if (!(response instanceof Array)) {
        warn('platforms.telegram', 'getUpdates did not return an array. waiting 5 seconds before trying again...')
        await new Promise(resolve => setTimeout(resolve, 5000))
        return this.getUpdates(offset)
      }

      this.incrementMessages(response.length)
      for (const update of response) {
        if (update.update_id >= (offset || 0)) {
          offset = update.update_id + 1
        }

        if (update.message) {
          handleTelegramMessage(this.bot.username!, update.message).then((ctx) => {
            if (!ctx || !ctx.replyWith) return
            return this.deliverMessage(ctx, ctx.replyWith)
          })
        }
      }

      return this.getUpdates(offset)
    })
  }

  deliverMessage (ctx: Context, text: Replyable) {
    const id = ctx.channel?.id || ctx.author.id
    return this.sendMessage(id, text.toString())
  }

  sendMessage (chatId: string, text: string) {
    return this.request('sendMessage', {
      chat_id: chatId,
      text
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

      if (!response.ok) {
        warn('platforms.telegram', `The Telegram API returned an error: ${response.description}`)
      }

      return response.result
    })
  }
}