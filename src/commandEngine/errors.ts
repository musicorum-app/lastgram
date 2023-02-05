import { buildCommandUsage } from './command.js'
import { Context } from '../multiplatformEngine/common/context.js'

export class CommandError extends Error {
  constructor (public ctx: Context) {
    super(`Command error`)
  }

  get display () {
    return `Something went wrong.`
  }
}

export class MissingArgumentError extends CommandError {
  get display () {
    return this.ctx.t('Missing argument. This command should be used like this: `{{{usage}}}`', { usage: buildCommandUsage(this.ctx.command!, this.ctx.language) })
  }
}

export class InvalidArgumentError extends CommandError {
  get display () {
    return this.ctx.t('Invalid argument. This command should be used like this: `{{{usage}}}`', { usage: buildCommandUsage(this.ctx.command!, this.ctx.language) })
  }
}