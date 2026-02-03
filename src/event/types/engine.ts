import { MinimalContext } from '../../multiplatforms/common/context.js'

export type EventListenerIdentifier = { command: string, handler: string }
export type EventListenerHandler = (ctx: MinimalContext) => void | Promise<unknown>
