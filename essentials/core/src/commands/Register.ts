import { Command } from '../structures/commands/Command.js'

export default class Register extends Command {
  name = 'register'

  async run(ctx) {
    return 'que registruda'
  }
}
