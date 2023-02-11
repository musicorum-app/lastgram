import { Context } from '../../../multiplatformEngine/common/context.js'
import { fixLanguageFormat } from '../../helpers.js'
import { client } from '../../../fmEngine/index.js'

type Args = {
  username: string
}

export default async (ctx: Context, { username }: Args) => {
  const data = await client.user.getInfo(username)
  await ctx.createUserData(username, fixLanguageFormat(ctx.author.languageCode))
  ctx.reply(`commands:register.done`, { fmUsername: username })
}

export const info = {
  aliases: ['reg'],
  args: [{
    name: 'username',
    required: true
  }]
}
