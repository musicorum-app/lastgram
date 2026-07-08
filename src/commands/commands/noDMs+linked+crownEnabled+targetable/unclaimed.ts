import { Context } from "@/multiplatforms/common/context"
import { getUnclaimedGroupCrowns } from "@/database/operations/crowns"

export default async (ctx: Context) => {
    const unclaimed = await getUnclaimedGroupCrowns(ctx.channel.id.toString(), ctx.registeredUserData!.lastFmUsername, 10)

    if (unclaimed.length === 0) {
        return ctx.reply('commands:unclaimed.none')
    }

    ctx.reply('commands:unclaimed.list', {
        list: unclaimed.map((u, i) => `${i + 1}. **${u.entityName}** (${u.totalPlays} plays)`).join('\n')
    })
}

export const info = {
    description: "See artists that have no crowns in the server",
    aliases: ['hunt', 'unclaimedcrowns']
}
