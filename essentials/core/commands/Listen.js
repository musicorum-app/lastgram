import { FMCommand } from '../structures/commands/FMCommand.js'

export default class Listen extends FMCommand {
  name = 'ln'

  async run(ctx) {
    return 'oi amor'
  }
}
