import { Context, MinimalContext } from '../multiplatformEngine/common/context.js'
import { lt } from '../translationEngine/index.js'

export interface MinimalCommand {
  name: string
  protectionLevel: string
}

export interface Command extends MinimalCommand {
  aliases?: string[]
  args?: CommandArgs[]
  hidden?: boolean
  interactionHandlers?: { [key: string]: (ctx: MinimalContext) => Promise<void> }

  run? (ctx: Context, args?: Record<string, any>): Promise<void>
}

export interface CommandArgs {
  name: string
  required: boolean
  type?: 'string' | 'integer' | 'boolean'
  guard?: (arg: string) => boolean
  parse?: (arg: string) => any
}

export const buildCommandUsage = (command: Command, locale: string): string => {
  const args = command.args?.map(arg => {
    const name = lt(locale, `args:${command.name}.${arg.name}`, {})
    if (arg.required) return `<${name}>`
    return `[${name}]`
  }).join(' ')
  return `/${command.name} ${args}`.trim()
}
