import { Context } from '../../../multiplatformEngine/common/context.js'

export default async (ctx: Context) => {
  ctx.reply('commands:help.text')
}

export const info = {
  hidden: true
}
