import { AwaitingEvent, EngineEventList, EventConstraints, EventListener, isSameConstraint } from './types/engine.js'
import { debug } from '../loggingEngine/logging.js'
import { MinimalContext } from '../multiplatformEngine/common/context.js'

class EventEngine {
  private awaitingEvents: Map<string, Map<string, AwaitingEvent<any>[]>>

  constructor () {
    this.awaitingEvents = new Map()
  }

  queueEvent<T extends keyof EngineEventList> (constraints: EventConstraints, event: T, listener: EventListener) {
    debug('eventEngine.queueEvent', `queueing new event ${event} for platform ${constraints.platform}`)
    this.addEventToQueue(constraints, event, listener)
  }

  async dispatchEvent<T extends keyof EngineEventList> (constraints: EventConstraints, event: T, ctx: MinimalContext) {
    const platformListeners = this.awaitingEvents.get(constraints.platform)
    if (!platformListeners) return
    const listeners = platformListeners.get(constraints.userID)
    if (!listeners) return
    const eventListeners = listeners.filter(l => l.event === event && isSameConstraint(l.constraints, constraints))
    for (const listener of eventListeners) {
      const result = await listener.listener(ctx)
      if (result) {
        debug('eventEngine.dispatchEvent', `event ${event} for platform ${constraints.platform} was handled by listener`)
        this.removeEventFromQueue(constraints, listener)
      }
    }
  }

  private addEventToQueue<T extends keyof EngineEventList> (constraints: EventConstraints, event: T, listener: EventListener) {
    const platformListeners = this.awaitingEvents.get(constraints.platform) || new Map()
    const listeners: AwaitingEvent<T>[] = platformListeners.get(constraints.userID) || []
    listeners.push({
      event,
      listener: listener as EventListener,
      constraints
    })
    platformListeners.set(constraints.userID, listeners)
    this.awaitingEvents.set(constraints.platform, platformListeners)
  }

  private removeEventFromQueue<T extends keyof EngineEventList> (constraints: EventConstraints, event: AwaitingEvent<T>) {
    const platformListeners = this.awaitingEvents.get(constraints.platform) || new Map()
    const listeners = platformListeners.get(constraints.userID) || []
    const index = listeners.findIndex((l: AwaitingEvent<T>) => l.event === event.event && l.listener === event.listener)
    if (index > -1) {
      listeners.splice(index, 1)
    }
    platformListeners.set(constraints.userID, listeners)
    if (listeners.length === 0) {
      platformListeners.delete(constraints.userID)
    }

    this.awaitingEvents.set(constraints.platform, platformListeners)
  }
}

export const eventEngine = new EventEngine()
