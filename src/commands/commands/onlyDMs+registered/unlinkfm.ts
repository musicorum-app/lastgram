import { Context } from '@/multiplatforms/common/context'
import { updateUserByID } from '@/database'

export default async (ctx: Context) => {
    if (!ctx.guardData.registeredUserData!.sessionKey) {
        ctx.reply('commands:unlinkfm.notLinked')
        return
    }

    await updateUserByID(ctx.guardData.registeredUserData!.id, {
        sessionKey: null
    })
    ctx.reply('commands:unlinkfm.done')
}

export const info = {
    aliases: ['unlinklast']
}
