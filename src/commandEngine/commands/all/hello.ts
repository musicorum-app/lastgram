import { Context } from '../../../multiplatform/common/context.js'

export default (ctx: Context) => {
  ctx.reply('Hello, world!')
}

export const info = {
  aliases: ['hi']
}