import { Context } from "@/multiplatforms/common/context"
import { client } from "@/fm"
import { getUserChartsAll } from "@/fm/epistolares"
import { flag } from "country-emoji"
import { formatDistance, format, differenceInDays } from "date-fns"

export default async (ctx: Context) => {
    const user = ctx.targetedUser ?? ctx.registeredUser
    const userData = ctx.targetedUserData ?? ctx.registeredUserData

    const userInfo = await client.user.getInfo(userData.lastFmUsername)

    if (!userInfo) {
        ctx.reply('errors:fm')
        return
    }

    const [allCharts, recentTracks] = await Promise.all([
        getUserChartsAll(userData.lastFmUsername, 'overall', 1),
        client.user.getRecentTracks(userData.lastFmUsername, { limit: 5 })
    ])

    const trackList = recentTracks.tracks.length > 0
        ? recentTracks.tracks
            .map((track, i) => `${i + 1}. **${track.name}** - ${track.artist.name}`)
            .join('\n')
        : '🍃'

    const registrationDate = userInfo.registered

    const fullName = userData.displayName || user.name

    const daysSinceRegistration = differenceInDays(new Date(), registrationDate)
    const scrobbleRate = daysSinceRegistration > 0
        ? (userInfo.playCount / daysSinceRegistration).toFixed(1)
        : '0'

    const topArtist = allCharts?.artists.items[0]
    const topAlbum = allCharts?.albums.items[0]
    const topTrack = allCharts?.tracks.items[0]
    const hasPhoto = !!userInfo.images?.[userInfo.images.length - 1]?.url

    ctx.reply(
        'commands:last',
        {
            fullName,
            flagEmoji: userInfo.country ? flag(userInfo.country) ?? '🌍' : '🌍',
            scrobbles: userInfo.playCount.toLocaleString('en-US'),
            scrobbleRate,
            topArtist: topArtist?.name || 'Unknown',
            topArtistPlays: topArtist?.playCount.toLocaleString('en-US') || '0',
            topAlbum: topAlbum?.name || 'Unknown',
            topAlbumArtist: topAlbum?.artist || 'Unknown',
            topAlbumPlays: topAlbum?.playCount.toLocaleString('en-US') || '0',
            topTrack: topTrack?.name || 'Unknown',
            topTrackArtist: topTrack?.artist || 'Unknown',
            topTrackPlays: topTrack?.playCount.toLocaleString('en-US') || '0',
            registrationDistance: formatDistance(registrationDate, new Date(), { addSuffix: true }),
            registrationDate: format(registrationDate, 'MMMM dd, yyyy'),
            trackList,
            joinArrays: '\n'
        },
        hasPhoto ? {
            imageURL: userInfo.images?.[userInfo.images.length - 1]?.url,
            sendImageAsPhoto: true
        } : undefined
    )
}

export const info = {
    aliases: ["userinfo", "lastinfo"],
}
