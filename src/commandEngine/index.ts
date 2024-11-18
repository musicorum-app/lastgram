import { Command } from './command.js'
import { findCommand, loadedCommands } from './loader.js'
import { Context } from '../multiplatformEngine/common/context.js'
import { debug, error, grey } from '../loggingEngine/logging.js'
import { newHistogram } from '../loggingEngine/metrics.js'
import { Histogram } from 'prom-client'
import { CommandError, InvalidArgumentError, MissingArgumentError } from './errors.js'
import * as guards from './guards.js'

interface LastfmError {
  error: number
  message: string
  name: string
}

type GuardFunction = { name: string, execute: (ctx: Context) => Promise<boolean> }

export class CommandRunner {
  private metric: Histogram = newHistogram('command_duration_seconds', 'Duration of commands in seconds', ['name', 'platform', 'error', 'important'])

  constructor (
    public commands: Command[]
  ) {
  }

  async runGuard (protectionLevel: string, ctx: Context): Promise<boolean> {
    const guardList: GuardFunction[] = protectionLevel.split('+').map((guard: string) => {
      // @ts-ignore
      return { execute: guards[guard], name: guard }
    })
    const guardResults = await Promise.all(guardList.map((guard) => {
      ctx.guard = guard.name
      return guard.execute(ctx)
    }))
    ctx.guard = undefined
    return guardResults.every(result => result)
  }

  hasCommand (name: string): boolean {
    return this.commands.some(command => command.name === name || command.aliases?.includes?.(name))
  }

  async runCommand (name: string, ctx: Context) {
    const command = this.findCommand(name)
    if (!command) throw new Error(`Command ${name} not found. Ensure that it exists before running it.`)
    ctx.setCommand({ ...command })

    await ctx.getUserData(ctx.author, 'registeredUserData')
    ctx.setGuardData('registeredUser', ctx.author)

    const guardResult = await this.runGuard(command.protectionLevel, ctx)
    if (!guardResult) return

    const args: Record<string, any> = {}
    if (command.args) {
      try {
        command.args.forEach((arg, i) => {
          if (arg.required && !ctx.args[i]) throw new MissingArgumentError(ctx)
          if (arg.guard && !arg.guard(ctx.args[i])) throw new InvalidArgumentError(ctx)
          args[arg.name] = arg.parse ? arg.parse(ctx.args[i]) : ctx.args[i]
        })
      } catch (error) {
        this.handleError(error, ctx)
        return
      }
    }

    debug('commandEngine.runCommand', `running command ${name} for user ${ctx.author.id} (${ctx.author.name})`)

    const end = this.metric.startTimer({ name: command.name, platform: ctx.message.platform })
    try {
      const r = await command.run!(ctx, args)
      end({ error: 'false' })
      return r
    } catch (err) {
      const important = this.handleError(err, ctx)
      end({ error: 'true', important: important ? 'true' : 'false' })
      important && error('commandEngine.runCommand', `notable exception while running command ${name}\n${grey(err.stack)}`)
    }
  }

  findCommand (name: string) {
    return findCommand(name)
  }

  correctName (name: string) {
    if (this.commands.some(command => command.name === name)) return name
    const command = this.commands.find(command => command.aliases?.includes?.(name))
    return command?.name ?? undefined
  }

  private handleError (error: Error, ctx: Context) {
    if (error instanceof CommandError) {
      ctx.reply(error.display, {}, { noTranslation: true })
      return false
    }

    if ((error as object as LastfmError).error) {
      const correctError: LastfmError = error as LastfmError
      if (correctError.error === 6) {
        ctx.reply('errors:lastfm.userNotFound')
        return false
      }
      // internal errors
      if ([2, 11, 8].includes(correctError.error)) {
        //ctx.reply('Sorry, last.fm seems to be offline right now. Please, try again later.\nFor more information, check @lastfmstatus at Twitter.')
        ctx.reply('errors:lastfm.serviceUnavailable')
        return false
      }

      if ([3, 4, 5, 6, 7, 10, 26].includes(correctError.error)) {
        // ctx.reply('Sorry, a serious error has occoured while communicating with last.fm. Please, join @lastgramsupport for further information.')
        ctx.reply('errors:lastfm.seriousError')
        return true
      }
      // ctx.reply(`Sorry, an error with last.fm has occoured ({{error}})\nPlease, try again later.`, { error: ctx.t(error.message) })
      ctx.reply('errors:lastfm.genericError', { error: correctError.error })
      return false
    }

    // ctx.reply('An unknown error has occurred. Please, try again.')
    ctx.reply('errors:unknown')
    return true
  }
}

export const commandRunner = new CommandRunner(loadedCommands)

export const start = () => {
}
