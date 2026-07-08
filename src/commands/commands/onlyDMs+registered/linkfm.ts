import { Context, MinimalContext } from '@/multiplatforms/common/context'
import { finishAuth, prepareForAuth } from '@/fm/connect'
import { CommandButtonComponentType } from '@/multiplatforms/common/components/button'
import { setUserLastFmUsername } from '@/database'

export default async (ctx: Context) => {
    const linkURL = await prepareForAuth(ctx.guardData.registeredUserData!.id)

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
    const data = await finishAuth(ctx.guardData.registeredUserData!.id)
    if (!data) {
        ctx.reply('commands:linkfm.linkingError')
        return
    }

    if (data.username.toLowerCase() !== ctx.guardData.registeredUserData!.lastFmUsername.toLowerCase()) {
        await setUserLastFmUsername(ctx.guardData.registeredUserData!.id, data.username)
        ctx.reply('commands:linkfm.successWithUsername', {
            username: data.username
        })
        return
    }

    ctx.reply('commands:linkfm.success', { username: data.username })
}
export const info = {
    description: "Link your Last.fm account",
    aliases: ['linklast']
}
