import { client } from "@/database"
import { Context } from "@/multiplatforms/common/context"
import { CommandButtonComponentType } from "@/multiplatforms/common/components/button"

export default async (ctx: Context) => {
    const targetUser = ctx.targetedUserData!

    await client.user.update({
        where: { id: targetUser.id },
        data: { isCrownBanned: true }
    })

    ctx.components.addButton(
        { name: 'commands:crownban.clearCrowns', data: targetUser.id.toString(), type: CommandButtonComponentType.danger },
        'clearCrowns',
        undefined,
        ctx.author.id
    )

    ctx.reply('commands:crownban.success', { target: targetUser.displayName || targetUser.platformId })
}

export const clearCrowns = async (ctx: Context) => {
    const targetUserId = parseInt(ctx.interactionData!)
    if (isNaN(targetUserId)) return

    const userCrownHolders = await client.crownHolder.findMany({
        where: { userId: targetUserId, isCurrentHolder: true },
        select: { crownId: true }
    })

    await client.crownHolder.deleteMany({
        where: { userId: targetUserId }
    })
    
    const crownIds = userCrownHolders.map((ch: any) => ch.crownId)
    for (const crownId of crownIds) {
        const remaining = await client.crownHolder.count({
            where: { crownId, isCurrentHolder: true }
        })
        if (remaining === 0) {
            await client.crown.update({
                where: { id: crownId },
                data: { claimed: false }
            })
        }
    }

    ctx.reply('commands:crownban.cleared', { target: targetUserId.toString() }, { keepComponents: false })
}

export const info = {
    aliases: ['bancrown']
}
