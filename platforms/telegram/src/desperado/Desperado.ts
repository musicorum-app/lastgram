import fetch from 'node-fetch'
import EventEmitter from 'node:events'
import { Update } from './types/Update.js'
import { Logger } from '@lastgram/logging'
import { User } from './types/User.js'
import Utils from './structures/Utils.js'
import { Message } from './types/Message.js'

interface ITGResponse {
  ok: boolean
  result?: any
  description?: string
}

export class DesperadoClient extends EventEmitter {
  apiUrl = 'https://api.telegram.org/bot'
  utils: Utils
  me: User

  #token: string
  #currentOffset: number | undefined
  #shouldStop = false
  readonly #fullAPIUrl: string

  constructor(token: string) {
    super()
    if (!token) {
      Logger.error(
        'Desperado',
        'Please add the TELEGRAM_TOKEN var to your environment.'
      )
      process.exit(1)
    }
    this.#token = token

    this.#fullAPIUrl = this.apiUrl + token + '/'
    this.#currentOffset = undefined
    this.getMe()
      .then((me) => {
        Logger.info(
          'Desperado',
          `Logged in as ${me.first_name} (@${me.username})`
        )
        this.me = me
      })
      .catch(() => {
        Logger.error(
          'Desperado',
          'An invalid token was provided. Cannot (and will not) proceed.'
        )
        process.emit('exit', 1)
      })

    this.utils = new Utils(this)
  }

  startPolling(): Promise<void> {
    return this.fetchUpdates().then((ups) => {
      if (this.#shouldStop) return
      if (!this.me) return this.startPolling()
      ups.forEach((up) => {
        const type = DesperadoClient.#getUpdateType(up)
        this.emit(type[0], up[type[1]])
      })
      return this.startPolling()
    })
  }

  stop() {
    this.#shouldStop = true
    return true
  }

  fetchUpdates() {
    return this.getUpdates(this.#currentOffset).then((r) => {
      if (!r[0]) return []
      r = r.sort((a, b) => a.update_id - b.update_id)
      this.#currentOffset = r[r.length - 1].update_id + 1
      return r
    })
  }

  sendMessage(
    chatId: number,
    text: string,
    replyingTo: number
  ): Promise<Message> {
    return this.#request('sendMessage', {
      chat_id: chatId,
      text,
      reply_to_message_id: replyingTo
    }) as Promise<Message>
  }

  getMe(): Promise<User> {
    return this.#request('getMe') as Promise<User>
  }

  getUpdates(offset: number | undefined, data: any = {}): Promise<Update[]> {
    return this.#request('getUpdates', { offset, ...data }) as Promise<Update[]>
  }

  static #getUpdateType(up: Update): [string, keyof Update] {
    if (up.message) return ['message', 'message']
    if (up.channel_post) return ['channelPost', 'channel_post']
    if (up.edited_channel_post)
      return ['editedChannelPost', 'edited_channel_post']
    if (up.edited_message) return ['editedMessage', 'edited_message']
    return ['unknown', 'update_id']
  }

  #request(method: string, data: any = {}): Promise<any> {
    return fetch(this.#fullAPIUrl + method, {
      method: 'post',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
      .then((a) => a.json() as Promise<any>)
      .then((r: ITGResponse) => {
        if (!r.ok)
          Logger.error(
            'Desperado',
            `Request to ${method} failed: ${r.description!}`
          )
        else return r.result
        throw new Error(r.description!)
      })
      .catch((e) => {
        Logger.error(
          'Desperado',
          `Request to ${method} failed with an unrecoverable error: ${e.description}`
        )
        return e
      })
  }
}
