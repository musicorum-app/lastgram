import { Context } from '../multiplatform/common/context.js'

export interface Command {
  name: string
  aliases: string[]
  description?: string
  usage?: string
  protectionLevel: string

  run (ctx: Context): Promise<void>
}