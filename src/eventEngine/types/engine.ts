import { MinimalContext } from '../../multiplatformEngine/common/context.js'

export interface EngineEvent {
  data: string
}

export type EventListener = (ctx: MinimalContext) => Promise<boolean> | boolean

export type EngineEventList = {
  'buttonClick': undefined
}

export interface AwaitingEvent<T extends keyof EngineEventList> {
  event: keyof EngineEventList
  constraints: EventConstraints
  listener: EventListener
}

export interface EventConstraints {
  platform: string
  userID: string
  channelID: string
}

export const isSameConstraint = (a: EventConstraints, b: EventConstraints) => {
  const sameUserID = a.userID === b.userID || a.userID === '*' || b.userID === '*'
  const sameChannelID = a.channelID === b.channelID || a.channelID === '*' || b.channelID === '*'
  return a.platform === b.platform && sameUserID && sameChannelID
}
