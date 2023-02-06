import { Context } from '../../../multiplatformEngine/common/context.js'
import { buildCommandUsage } from '../../command.js'

type Args = {
  command: string
}

export default (ctx: Context, { command }: Args) => {
  if (command) {
    const cmd = ctx.runner.findCommand(command)
    if (!cmd) return ctx.reply('Command not found.')
    const usage = buildCommandUsage(cmd, ctx.language)
    return ctx.reply('Information for the **{{name}}** command\n{{description}}\n\nUsage: `{{{usage}}}`\n\n*Arguments between `< >` are required, while arguments between `[ ]` are optional.*', {
      name: cmd.name,
      description: ctx.t(cmd.description || 'No description available'),
      usage
    })
  }
  return ctx.reply('👋 Howdy. lastgram is a bot for last.fm users, allowing them to interact with the service through Telegram.\n\nNews, updates and more: https://t.me/lastgramdaily\nSupport and vibes: https://t.me/lastgramsupport\n\nUse `/help <command>` to get more information about a command.')
}

export const info = {
  aliases: ['ajuda'],
  description: 'Shows this help message.',
  args: [{
    name: 'command',
    required: false,
    displayName: 'command name'
  }]
}