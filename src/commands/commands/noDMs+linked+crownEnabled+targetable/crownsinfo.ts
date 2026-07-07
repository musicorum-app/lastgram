import { Context } from "@/multiplatforms/common/context"
import { getGroupCrownStats, getUsersWithMostCrowns } from "@/database/operations/crowns"

export default async (ctx: Context) => {
    const stats = await getGroupCrownStats(ctx.channel.id)
    const mostCrowns = await getUsersWithMostCrowns(ctx.channel.id)

    ctx.reply('commands:crownsinfo', {
        total: stats.totalCrowns,
        switched: stats.mostSwitched.length > 0 ? stats.mostSwitched.map((c, i) => `${i + 1}. **${c.entity.name}** (${c.switchedTimes} switches)`).join('\n') : "No contested crowns yet.",
        played: stats.topPlayed.length > 0 ? stats.topPlayed.map((c, i) => `${i + 1}. **${c.crown.entity.name}** (${c.playCount} plays by ${c.user.displayName || c.user.platformId})`).join('\n') : "No active crowns yet.",
        topUsers: mostCrowns.length > 0 ? mostCrowns.map((u, i) => `${i + 1}. **${u.name}** (${u.playCount} crowns)`).join('\n') : "No crown holders yet."
    })
}

export const info = {
    aliases: ['cinfo', 'crownsstats']
}
