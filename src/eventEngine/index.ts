import { EventListenerHandler, EventListenerIdentifier } from './types/engine.js'
import { debug } from '../loggingEngine/logging.js'
import { MinimalContext } from '../multiplatformEngine/common/context.js'
import { backend } from '../cachingEngine/index.js'

// event key: event_<id>
// the value is the handler function name

class EventEngine {
  extractIDFromData (data: string): [string, string] {
    const [command, handler] = data.split('::')
    return [command, handler]
  }

  queueEvent (id: string, listener: EventListenerIdentifier) {
    debug('eventEngine.queueEvent', `queueing new event under id ${id}`)
    this.addEventToQueue(id, listener)
  }

  async dispatchEvent (id: string, ctx: MinimalContext) {
    const key = `event_${id}`
    const keyValue = await backend!.get(key)
    debug('eventEngine.dispatchEvent', `id ${id} path: ${keyValue}`)
    if (!keyValue) return
    const [commandName, handlerName] = keyValue.split('.')

    const commandEngine = await import('../commandEngine/index.js').then(m => m.commandRunner)
    const command = commandEngine.findCommand(commandName)!
    const handler: EventListenerHandler = command.interactionHandlers![handlerName]
    if (!handler) return

    this.removeEventFromQueue(key)

    return handler(ctx)
  }

  private addEventToQueue (id: string, listener: EventListenerIdentifier) {
    const key = `event_${id}`
    backend!.setTTL(key, `${listener.command}.${listener.handler}`, 15 * 60 * 1000).then(() => undefined)
  }

  private removeEventFromQueue (key: string) {
    backend!.delete(key).then(() => undefined)
  }
}

export const eventEngine = new EventEngine()
