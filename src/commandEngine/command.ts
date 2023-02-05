import { Context } from '../multiplatformEngine/common/context.js'
import { lt } from '../translationEngine/index.js'

export interface Command {
  name: string
  aliases: string[]
  description?: string
  protectionLevel: string
  args?: CommandArgs[]

  run? (ctx: Context, args?: Record<string, any>): Promise<void>
}

export interface CommandArgs {
  name: string
  required: boolean
  displayName?: string
  guard?: (arg: string) => boolean
  parse?: (arg: string) => any
}

export const buildCommandUsage = (command: Command, locale: string): string => {
  const args = command.args?.map(arg => {
    const name = arg.displayName ? lt(locale, arg.displayName) : arg.name
    if (arg.required) return `<${name}>`
    return `[${name}]`
  }).join(' ')
  return `/${command.name} ${args}`.trim()
}