import { Context } from "@/multiplatforms/common/context"
import { getUserCrownWorth } from "@/database/operations/crowns"

export default async (ctx: Context) => {
    const targetUser = ctx.targetedUser ?? ctx.registeredUser
    const targetUserId = ctx.targetedUserData?.id ?? ctx.registeredUserData?.id

    if (!targetUserId) {
        return
    }

    const worth = await getUserCrownWorth(ctx.channel.id, targetUserId)

    ctx.reply('commands:crownworth', {
        user: targetUser.name,
        worth
    })
}

export const info = {
    aliases: ['cworth', 'worth']
}
