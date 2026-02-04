import { Context } from '@/multiplatforms/common/context'
import { fixLanguageFormat } from '../../helpers.js'
import { client } from '@/fm'
import { getUser, upsertUserDisplayName } from '@/database'

type Args = {
    username: string
}

export default async (ctx: Context, { username }: Args) => {
    const user = await getUser(ctx.userPlatformId())

    if (user?.sessionKey) {
        ctx.reply('commands:register.linked')
        return
    }
    await client.user.getInfo(username)
    await upsertUserDisplayName(ctx.author.name, username)
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
