import { Context, MinimalContext } from '@/multiplatforms/common/context'
import { finishAuth, prepareForAuth } from '@/fm/connect'
import { CommandButtonComponentType } from '@/multiplatforms/common/components/button'
import { setUserLastFmUsername, updateUserByID } from '@/database'
import { fixLanguageFormat } from '../../helpers.js'

export default async (ctx: Context) => {
    const user = await ctx.getUserData(ctx.author, 'registeredUserData')
    if (user?.sessionKey) {
        return ctx.reply('commands:register.linked')
    }

    const linkURL = await prepareForAuth(ctx.userPlatformId())

    ctx.components.addButton({
        name: 'commands:linkfm.buttons.link',
        emoji: '🔗',
        url: linkURL,
        type: CommandButtonComponentType.link
    })

    ctx.components.newGroup((builder) => {
        builder.addButton({
            name: 'core:buttons.done',
            emoji: '✅',
            type: CommandButtonComponentType.success
        }, 'doneLinking')

        builder.addButton({
            name: 'core:buttons.cancel',
            emoji: '❌',
            type: CommandButtonComponentType.danger
        }, 'cancelLinking')
    })

    ctx.reply('commands:linkfm.link')
}

export const cancelLinking = async (ctx: MinimalContext) => {
    ctx.reply('core:dialogues.cancelled')
}

export const doneLinking = async (ctx: MinimalContext) => {
    const session = await finishAuth(ctx.userPlatformId())
    if (!session) {
        ctx.reply('commands:linkfm.linkingError')
        return
    }

    const createdUser = await ctx.createUserData(session.username, fixLanguageFormat(ctx.author.languageCode))
    await updateUserByID(createdUser.id, {
        sessionKey: session.key,
        lastFmUser: {
            connectOrCreate: {
                where: { fmUsername: session.username.toLowerCase() },
                create: { fmUsername: session.username.toLowerCase() }
            }
        }
    })

    const previousFmUsername = ctx.guardData.registeredUserData?.lastFmUsername

    if (previousFmUsername && session.username.toLowerCase() !== previousFmUsername.toLowerCase()) {
        await setUserLastFmUsername(createdUser.id, session.username)
        ctx.reply('commands:linkfm.successWithUsername', {
            username: session.username
        })
        return
    }

    ctx.reply('commands:linkfm.success', { username: session.username })
}
export const info = {
    description: "Link your Last.fm account",
    aliases: ['linklast', 'register', 'reg']
}
