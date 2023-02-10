import { buildCommandUsage } from './command.js'
import { Context } from '../multiplatformEngine/common/context.js'

export class CommandError extends Error {
  constructor (public ctx: Context) {
    super(`Command error`)
  }

  get display () {
    return this.ctx.t('errors:command.generic')
  }
}

export class MissingArgumentError extends CommandError {
  get display () {
    return this.ctx.t('errors:command.missingArgument`', { usage: buildCommandUsage(this.ctx.command!, this.ctx.language) })
  }
}

export class InvalidArgumentError extends CommandError {
  get display () {
    return this.ctx.t('errors:command.invalidArgument', { usage: buildCommandUsage(this.ctx.command!, this.ctx.language) })
  }
}

export class NoScrobblesError extends CommandError {
  get display () {
    return this.ctx.t('errors:command.noScrobbles')
  }
}
