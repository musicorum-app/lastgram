import { Context } from '../multiplatformEngine/common/context.js'

export interface Command {
  name: string
  aliases: string[]
  description?: string
  usage?: string
  protectionLevel: string
  args?: CommandArgs[]

  run (ctx: Context, args?: Record<string, any>): Promise<void>
}

export interface CommandArgs {
  name: string
  required: boolean
  guard?: (arg: string) => boolean
  parse?: (arg: string) => any
}