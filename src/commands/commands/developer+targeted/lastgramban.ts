import { client } from "@/database"
import { Context } from "@/multiplatforms/common/context"

export default async (ctx: Context) => {
    const targetUser = ctx.targetedUserData!

    await client.user.update({
        where: { id: targetUser.id },
        data: { isBanned: true }
    })

    ctx.reply('commands:lastgramban.success', { target: targetUser.displayName || targetUser.platformId })
}

export const info = {
    aliases: ['banuser']
}
