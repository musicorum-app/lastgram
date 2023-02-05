import { Command } from './command.js'
import { loadCommands } from './loader.js'
import { Context } from '../multiplatformEngine/common/context.js'
import { debug, error } from '../loggingEngine/logging.js'
import { newHistogram } from '../loggingEngine/metrics.js'
import { Histogram } from 'prom-client'
import { CommandError, InvalidArgumentError, MissingArgumentError } from './errors.js'
import { LastfmError } from '@musicorum/lastfm/dist/error/LastfmError.js'

class CommandRunner {
  private metric: Histogram = newHistogram('command_duration_seconds', 'Duration of commands in seconds', ['name', 'platform', 'error', 'important'])

  constructor (
    public commands: Command[]
  ) {
  }

  hasCommand (name: string): boolean {
    return this.commands.some(command => command.name === name || command.aliases?.includes?.(name))
  }

  async runCommand (name: string, ctx: Context) {
    const command = this.findCommand(name)
    if (!command) throw new Error(`Command ${name} not found. Ensure that it exists before running it.`)

    switch (command.protectionLevel) {
      case 'registered':
        const u = await ctx.getUserData()
        if (!u) {
          ctx.reply('core:error.notRegistered')
          return
        }
        break
      default:
    }

    const args: Record<string, any> = {}
    if (command.args) {
      try {
        command.args.forEach((arg, i) => {
          if (arg.required && !ctx.args[i]) throw new MissingArgumentError(arg.name)
          if (arg.guard && !arg.guard(ctx.args[i])) throw new InvalidArgumentError(arg.name)
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
      const r = await command.run(ctx, args)
      end({ error: 'false' })
      return r
    } catch (err) {
      const important = this.handleError(err, ctx)
      end({ error: 'true', important: important ? 'true' : 'false' })
      important && error('commandEngine.runCommand', `notable exception while running command ${name}: ${err}`)
    }
  }

  findCommand (name: string) {
    return this.commands.find(command => command.name === name || command.aliases?.includes?.(name))
  }

  async reloadCommands () {
    this.commands = await loadCommands()
  }

  private handleError (error: Error, ctx: Context) {
    if (error instanceof CommandError) {
      ctx.reply(error.translationKey)
      return false
    }
    if (error instanceof LastfmError) {
      ctx.reply(`core:error.fmError${error.response.error}`)
      return false
    }

    ctx.reply('core:error.unknown')
    return true
  }
}

export const commandRunner = new CommandRunner(await loadCommands())

export const start = () => {
}