export class CommandError extends Error {
  constructor (public translationKey: string, public data?: Record<string, any>) {
    super(`Command error`)
  }
}

export class MissingArgumentError extends CommandError {
  constructor (public argName: string) {
    super('core:error.missingArgument', { argName })
  }
}

export class InvalidArgumentError extends CommandError {
  constructor (public argName: string) {

    super('core:error.invalidArgument', { argName })
  }
}