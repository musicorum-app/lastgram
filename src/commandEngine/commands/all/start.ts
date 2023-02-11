import { Context } from '../../../multiplatformEngine/common/context.js'

export default async (ctx: Context) => {
  ctx.reply('commands:start')
}

export const info = {
  hidden: true
}
