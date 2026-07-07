import { client } from "@/database"
import { Context } from "@/multiplatforms/common/context"

export default async (ctx: Context) => {
    const targetUser = ctx.targetedUserData!

    await client.user.update({
        where: { id: targetUser.id },
        data: { isCrownBanned: false }
    })

    ctx.reply('commands:crownunban.success', { target: targetUser.displayName || targetUser.platformId })
}

export const info = {
    aliases: ['unbancrown']
}
