import { Context } from '../../../multiplatformEngine/common/context.js'

export default (ctx: Context) => {
  ctx.reply('Hello, world!')
}

export const info = {
  aliases: ['lastgraminfo'],
  description: 'Shows information about the bot.'
}