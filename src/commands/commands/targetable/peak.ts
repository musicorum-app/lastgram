import { Context } from "@/multiplatforms/common/context"
import { client } from "@/fm"
import { backend } from "@/caching"
import { inferDataFromContent } from "@/commands/helpers"
import { getUserDisplayName } from "@/database"
import { format, subDays, subMonths, startOfDay } from "date-fns"

const getPeriodDates = (period: '7day' | '1month' | '3month' | '6month' | '12month' | 'overall') => {
    const now = new Date()
    const today = startOfDay(now)

    switch (period) {
        case '7day':
            return { from: subDays(today, 7), to: now }
        case '1month':
            return { from: subMonths(today, 1), to: now }
        case '3month':
            return { from: subMonths(today, 3), to: now }
        case '6month':
            return { from: subMonths(today, 6), to: now }
        case '12month':
            return { from: subMonths(today, 12), to: now }
        case 'overall':
            return { from: undefined, to: undefined }
    }
}

const getPeriodLabel = (period: '7day' | '1month' | '3month' | '6month' | '12month' | 'overall') => {
    switch (period) {
        case '7day': return 'last 7 days'
        case '1month': return 'last month'
        case '3month': return 'last 3 months'
        case '6month': return 'last 6 months'
        case '12month': return 'last year'
        case 'overall': return 'all time'
    }
}

const isSuspicious = (scrobbles: number) => {
    const hours = (scrobbles * 3) / 60
    return hours > 24
}

type TrackInfo = {
    name: string
    artist: string
    album: string
}

type DayStats = {
    date: string
    totalScrobbles: number
    tracks: Map<string, { count: number, info: TrackInfo }>
    artists: Map<string, number>
    albums: Map<string, { count: number, artist: string }>
}

export default async (ctx: Context) => {
    const user = ctx.targetedUser ?? ctx.registeredUser
    const userData = ctx.targetedUserData ?? ctx.registeredUserData

    const args = ctx.args.join(' ')
    const parsed = inferDataFromContent(args || '7day')
    const period = parsed.period

    const displayNameData = await getUserDisplayName(userData.fmUsername)
    const displayName = displayNameData?.displayName || user.name

    const cacheKey = `peak:${userData.fmUsername}:${period}`

    const cached = await backend?.get(cacheKey)
    if (cached) {
        const cachedData = JSON.parse(cached)

        const wandaVisionWarning = cachedData.hasSuspicious
            ? ctx.t('commands:peak.wandaVision', { hours: cachedData.suspiciousHours.toFixed(1) })
            : ''

        const moreDataNote = cachedData.hasMorePages
            ? ctx.t('commands:peak.moreData')
            : ''

        const totalSirenEmoji = cachedData.totalIsSuspicious ? '🚨 ' : ''
        const listeningHours = ((cachedData.totalScrobbles * 3) / 60).toFixed(1)

        ctx.reply('commands:peak', {
            displayName,
            peakDate: format(new Date(cachedData.date), 'MMMM dd, yyyy'),
            totalSirenEmoji,
            totalScrobbles: cachedData.totalScrobbles,
            listeningHours,
            period: getPeriodLabel(period),
            topTracks: cachedData.topTracks,
            topArtists: cachedData.topArtists,
            topAlbums: cachedData.topAlbums,
            wandaVisionWarning,
            moreDataNote,
            joinArrays: '\n'
        })
        return
    }


    const { from, to } = getPeriodDates(period)
    const dayStats = new Map<string, DayStats>()

    let page = 1
    const maxPages = period === 'overall' ? 50 : 20
    let hasMorePages = false

    while (page <= maxPages) {
        const tracks = await client.user.getRecentTracks(userData.fmUsername, {
            limit: 200,
            page,
            from,
            to
        })

        if (!tracks.tracks.length) break

        for (const track of tracks.tracks) {
            if (track.nowPlaying || !track.date) continue

            const dayKey = format(track.date, 'yyyy-MM-dd')

            if (!dayStats.has(dayKey)) {
                dayStats.set(dayKey, {
                    date: dayKey,
                    totalScrobbles: 0,
                    tracks: new Map(),
                    artists: new Map(),
                    albums: new Map()
                })
            }

            const stats = dayStats.get(dayKey)!
            stats.totalScrobbles++

            const trackKey = `${track.name}|||${track.artist.name}`
            const trackData = stats.tracks.get(trackKey)
            if (trackData) {
                trackData.count++
            } else {
                stats.tracks.set(trackKey, {
                    count: 1,
                    info: { name: track.name, artist: track.artist.name, album: track.album.name }
                })
            }

            const artistKey = track.artist.name
            stats.artists.set(artistKey, (stats.artists.get(artistKey) || 0) + 1)

            const albumKey = `${track.album.name}|||${track.artist.name}`
            const albumData = stats.albums.get(albumKey)
            if (albumData) {
                albumData.count++
            } else {
                stats.albums.set(albumKey, { count: 1, artist: track.artist.name })
            }
        }

        const totalPages = parseInt(tracks.attr?.totalPages || '1')
        if (page >= totalPages) break

        if (page >= maxPages) {
            hasMorePages = true
            break
        }

        page++
    }

    // Find peak day
    let peakDay: DayStats | null = null
    for (const stats of dayStats.values()) {
        if (!peakDay || stats.totalScrobbles > peakDay.totalScrobbles) {
            peakDay = stats
        }
    }

    if (!peakDay) {
        ctx.reply('commands:peak.noScrobbles', {
            displayName,
            period: getPeriodLabel(period)
        })
        return
    }

    const topTracks = Array.from(peakDay.tracks.entries())
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 3)
        .map((entry, i) => {
            const emoji = isSuspicious(entry[1].count) ? '🚨 ' : ''
            return `${i + 1}. ${emoji}**${entry[1].info.name}** by ${entry[1].info.artist} (${entry[1].count} plays)`
        })
        .join('\n')

    const topArtists = Array.from(peakDay.artists.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map((entry, i) => {
            const emoji = isSuspicious(entry[1]) ? '🚨 ' : ''
            return `${i + 1}. ${emoji}**${entry[0]}** (${entry[1]} plays)`
        })
        .join('\n')

    const topAlbums = Array.from(peakDay.albums.entries())
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 3)
        .map((entry, i) => {
            const [albumName] = entry[0].split('|||')
            const emoji = isSuspicious(entry[1].count) ? '🚨 ' : ''
            return `${i + 1}. ${emoji}**${albumName}** by ${entry[1].artist} (${entry[1].count} plays)`
        })
        .join('\n')

    const hasSuspicious = Array.from(peakDay.tracks.values()).some(t => isSuspicious(t.count)) ||
                         Array.from(peakDay.artists.values()).some(a => isSuspicious(a)) ||
                         Array.from(peakDay.albums.values()).some(a => isSuspicious(a.count))

    const totalIsSuspicious = isSuspicious(peakDay.totalScrobbles)

    const suspiciousHours = hasSuspicious || totalIsSuspicious
        ? Math.max(
            ...Array.from(peakDay.tracks.values()).map(t => (t.count * 3) / 60),
            ...Array.from(peakDay.artists.values()).map(a => (a * 3) / 60),
            ...Array.from(peakDay.albums.values()).map(a => (a.count * 3) / 60),
            (peakDay.totalScrobbles * 3) / 60
        )
        : 0

    const resultData = {
        date: peakDay.date,
        totalScrobbles: peakDay.totalScrobbles,
        totalIsSuspicious,
        topTracks,
        topArtists,
        topAlbums,
        hasSuspicious: hasSuspicious || totalIsSuspicious,
        suspiciousHours,
        hasMorePages
    }

    const ttl = period === 'overall' ? 60 * 60 * 6 : 60 * 60
    await backend?.setTTL(cacheKey, JSON.stringify(resultData), ttl)

    const wandaVisionWarning = (hasSuspicious || totalIsSuspicious)
        ? ctx.t('commands:peak.wandaVision', { hours: suspiciousHours.toFixed(1) })
        : ''

    const moreDataNote = hasMorePages
        ? ctx.t('commands:peak.moreData')
        : ''

    const totalSirenEmoji = totalIsSuspicious ? '🚨 ' : ''
    const listeningHours = ((peakDay.totalScrobbles * 3) / 60).toFixed(1)

    ctx.reply('commands:peak', {
        displayName,
        peakDate: format(new Date(peakDay.date), 'MMMM dd, yyyy'),
        totalSirenEmoji,
        totalScrobbles: peakDay.totalScrobbles,
        listeningHours,
        period: getPeriodLabel(period),
        topTracks,
        topArtists,
        topAlbums,
        wandaVisionWarning,
        moreDataNote,
        joinArrays: '\n'
    })
}

export const info = {
    aliases: ["bestday", "peakday", "topday", "best"],
}
