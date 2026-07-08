import { Context } from "@/multiplatforms/common/context"
import { getUserCharts } from "@/fm/epistolares"
import { backend } from "@/caching"

export default async (ctx: Context) => {
    const userA = ctx.registeredUserData
    const userB = ctx.targetedUserData

    if (!userB || !ctx.message.replyingToUser) {
        return ctx.reply('errors:guards.targetable.userNotMentioned')
    }

    const sortedUsernames = [userA.lastFmUsername, userB.lastFmUsername].sort().join(':')
    const cacheKey = `compat:${sortedUsernames}`

    let cachedData: any = null
    const cached = await backend?.get(cacheKey)
    if (cached) {
        cachedData = JSON.parse(cached)
    }

    if (!cachedData) {
        const [chartsA, chartsB] = await Promise.all([
            getUserCharts(userA.lastFmUsername, 'artist', 'overall', 50),
            getUserCharts(userB.lastFmUsername, 'artist', 'overall', 50)
        ])

        if (!chartsA || !chartsB) {
            return ctx.reply('errors:fm')
        }

        const mapA = new Map<string, number>()
        const mapB = new Map<string, number>()
        const commonArtists: { name: string, score: number, playsA: number, playsB: number }[] = []

        for (const item of chartsA.items) {
            mapA.set(item.id, item.playCount)
        }

        for (const item of chartsB.items) {
            mapB.set(item.id, item.playCount)
            if (mapA.has(item.id)) {
                const playsA = mapA.get(item.id)!
                const playsB = item.playCount
                commonArtists.push({
                    name: item.name!,
                    score: Math.sqrt(playsA * playsB),
                    playsA,
                    playsB
                })
            }
        }

        const allIds = new Set([...mapA.keys(), ...mapB.keys()])

        let dotProduct = 0
        let normA = 0
        let normB = 0

        for (const id of allIds) {
            const a = mapA.get(id) || 0
            const b = mapB.get(id) || 0

            dotProduct += a * b
            normA += a * a
            normB += b * b
        }

        let percentage = 0
        if (normA > 0 && normB > 0) {
            const cosineSimilarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
            percentage = Math.round(cosineSimilarity * 100)
        }

        let tierKey = ''
        let tierEmoji = ''
        if (percentage >= 90) { tierKey = 'soulmates'; tierEmoji = '💍' }
        else if (percentage >= 80) { tierKey = 'highSchoolSweethearts'; tierEmoji = '💖' }
        else if (percentage >= 70) { tierKey = 'marriedCouple'; tierEmoji = '💑' }
        else if (percentage >= 60) { tierKey = 'closeFriends'; tierEmoji = '🫂' }
        else if (percentage >= 50) { tierKey = 'friends'; tierEmoji = '🤝' }
        else if (percentage >= 40) { tierKey = 'schoolAcquaintances'; tierEmoji = '👋' }
        else if (percentage >= 25) { tierKey = 'yourEx'; tierEmoji = '💔' }
        else if (percentage >= 10) { tierKey = 'notReally'; tierEmoji = '😬' }
        else { tierKey = 'absolutelyNot'; tierEmoji = '🛑' }

        commonArtists.sort((a, b) => b.score - a.score)

        cachedData = {
            percentage,
            tierKey,
            tierEmoji,
            commonArtists: commonArtists.slice(0, 3).map(a => ({
                name: a.name,
                playsMap: {
                    [userA.lastFmUsername]: a.playsA,
                    [userB.lastFmUsername]: a.playsB
                }
            }))
        }

        await backend?.setTTL(cacheKey, JSON.stringify(cachedData), 7200) // 2 hours
    }

    // top 3 common artists
    const topCommon = cachedData.commonArtists.map((a: any) => ctx.t('commands:compat.artistLine', {
        name: a.name,
        playsA: (a.playsMap[userA.lastFmUsername] || 0).toLocaleString('en-US'),
        playsB: (a.playsMap[userB.lastFmUsername] || 0).toLocaleString('en-US')
    })).join('\n')

    const commonText = topCommon
        ? ctx.t('commands:compat.sharedArtists', { artists: topCommon, joinArrays: '\n' })
        : ctx.t('commands:compat.noSharedArtists')

    ctx.reply('commands:compat.message', {
        userA: userA.displayName || ctx.author.name,
        userB: userB.displayName || ctx.message.replyingToUser.name,
        percentage: cachedData.percentage,
        tier: ctx.t('commands:compat.tiers.' + cachedData.tierKey),
        tierEmoji: cachedData.tierEmoji,
        commonText
    })
}

export const info = {
    description: "Check your music compatibility with another user",
    aliases: ['compatibility', 'taste', 'match']
}
