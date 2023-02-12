import { EventListenerHandler, EventListenerIdentifier } from './types/engine.js'
import { debug } from '../loggingEngine/logging.js'
import { MinimalContext } from '../multiplatformEngine/common/context.js'
import { backend } from '../cachingEngine/index.js'
import { ExpiredError, NoPermissionError, UnknownError } from './types/errors.js'

// event key: event_<id>
// the value is the handler function name

class EventEngine {
  extractIDFromData (data: string): [string, string] {
    const [command, handler] = data.split('::')
    return [command, handler]
  }

  queueEvent (id: string, userID: string, listener: EventListenerIdentifier) {
    debug('eventEngine.queueEvent', `queueing new event under id ${id}`)
    this.addEventToQueue(id, userID, listener)
  }

  async dispatchEvent (id: string, ctx: MinimalContext) {
    const key = `event_${id}`
    const keyValue = await backend!.get(key)
    debug('eventEngine.dispatchEvent', `id ${id} path: ${keyValue}`)
    if (!keyValue) throw new ExpiredError()
    const [commandNameAndID, handlerName] = keyValue.split('.')
    const [userId, commandName] = commandNameAndID.split('_')

    if (ctx.author.id !== userId && userId !== '*') throw new NoPermissionError()

    const commandEngine = await import('../commandEngine/index.js').then(m => m.commandRunner)
    const command = commandEngine.findCommand(commandName)!
    const handler: EventListenerHandler = command.interactionHandlers![handlerName]
    if (!handler) throw new UnknownError()

    this.removeEventFromQueue(key)

    return handler(ctx)?.catch?.(() => {
      throw new UnknownError()
    })
  }

  private addEventToQueue (id: string, userID: string, listener: EventListenerIdentifier) {
    const key = `event_${id}`
    backend!.setTTL(key, `${userID}_${listener.command}.${listener.handler}`, 15 * 60 * 1000).then(() => undefined)
  }

  private removeEventFromQueue (key: string) {
    backend!.delete(key).then(() => undefined)
  }
}

export const eventEngine = new EventEngine()
