import { FMCommand } from '../structures/commands/FMCommand.js'

export default class Listen extends FMCommand {
  name = 'ln'

  async run(ctx, { user }) {
    console.log(user)
    return 'oi amor'
  }
}
