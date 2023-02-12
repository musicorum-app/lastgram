import { Context, MinimalContext } from '../../../multiplatformEngine/common/context.js'
import { CommandButtonComponentType } from '../../../multiplatformEngine/common/components/button.js'
import { exec } from 'child_process'

export default async (ctx: Context) => {
  ctx.components.addButton({
    name: 'commands:devpanel.buttons.updateDiscordCommands',
    emoji: '🔄',
    type: CommandButtonComponentType.primary
  }, 'updateDiscordCommand')

  ctx.reply('commands:devpanel.pickAnAction')
}

export const updateDiscordCommand = async (ctx: MinimalContext) => {
  await exec('node dist/cli.js updateDiscordCommands')
  ctx.reply('commands:devpanel.discordCommandsUpdated')
}
