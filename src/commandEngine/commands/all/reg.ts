import { Context } from '../../../multiplatformEngine/common/context.js'
import { fixTelegramLanguageCode } from '../../helpers.js'
import { client } from '../../../fmEngine/index.js'

type Args = {
  fmUsername: string
}

export default async (ctx: Context, { fmUsername }: Args) => {
  const data = await client.user.getInfo(fmUsername)
  await ctx.createUserData(fmUsername, fixTelegramLanguageCode(ctx.author.languageCode))
  ctx.reply(`Hello, ${fmUsername}!`)
}

export const info = {
  aliases: ['register'],
  args: [{
    name: 'fmUsername',
    required: true
  }]
}