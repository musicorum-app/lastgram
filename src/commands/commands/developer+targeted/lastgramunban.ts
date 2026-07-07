import { client } from "@/database"
import { Context } from "@/multiplatforms/common/context"

export default async (ctx: Context) => {
    const targetUser = ctx.targetedUserData!

    await client.user.update({
        where: { id: targetUser.id },
        data: { isBanned: false }
    })

    ctx.reply('commands:lastgramunban.success', { target: targetUser.displayName || targetUser.platformId })
}

export const info = {
    aliases: ['unbanuser']
}
