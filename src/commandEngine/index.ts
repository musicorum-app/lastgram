import { Command } from './command.js'
import { loadCommands } from './loader.js'
import { Context } from '../multiplatform/common/context.js'
import { debug } from '../loggingEngine/logging.js'
import { newHistogram } from '../loggingEngine/metrics.js'
import { Histogram } from 'prom-client'

class CommandRunner {
  private metric: Histogram

  constructor (
    public commands: Command[]
  ) {
    this.metric = newHistogram('command_duration_seconds', 'Duration of commands in seconds', ['name', 'platform', 'error'])
  }

  hasCommand (name: string): boolean {
    return this.commands.some(command => command.name === name || command.aliases?.includes?.(name))
  }

  async runCommand (name: string, ctx: Context) {
    const command = this.findCommand(name)
    if (!command) throw new Error(`Command ${name} not found. Ensure that it exists before running it.`)
    debug('commandEngine.runCommand', `running command ${name} for user ${ctx.author.id} (${ctx.author.name})`)

    const end = this.metric.startTimer({ name: command.name, platform: ctx.message.platform })
    try {
      const r = command.run(ctx)
      end({ error: 'false' })
      return r
    } catch (error) {
      end({ error: 'true' })
      error('commandEngine.runCommand', `error while running command ${name}: ${error}`)
    }
  }

  findCommand (name: string): Command | undefined {
    return this.commands.find(command => command.name === name || command.aliases?.includes?.(name))
  }

  async reloadCommands (): Promise<void> {
    this.commands = await loadCommands()
  }
}

export const commandRunner = new CommandRunner(await loadCommands())

export const start = () => {
}