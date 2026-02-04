import { Context } from "@/multiplatforms/common/context"
import { client } from "@/fm"
import { flag } from "country-emoji"
import { formatDistance, format, differenceInDays } from "date-fns"
import { getUserDisplayName } from "@/database"

export default async (ctx: Context) => {
    const user = ctx.targetedUser ?? ctx.registeredUser
    const userData = ctx.targetedUserData ?? ctx.registeredUserData

    const [userInfo, displayNameData] = await Promise.all([
        client.user.getInfo(userData.fmUsername),
        getUserDisplayName(userData.fmUsername)
    ])

    if (!userInfo) {
        ctx.reply('errors:fm')
        return
    }

    const [topArtists, topAlbums, topTracks, recentTracks] = await Promise.all([
        client.user.getTopArtists(userData.fmUsername, { limit: 1 }),
        client.user.getTopAlbums(userData.fmUsername, { limit: 1 }),
        client.user.getTopTracks(userData.fmUsername, { limit: 1 }),
        client.user.getRecentTracks(userData.fmUsername, { limit: 5 })
    ])

    const trackList = recentTracks.tracks.length > 0
        ? recentTracks.tracks
            .map((track, i) => `${i + 1}. **${track.name}** - ${track.artist.name}`)
            .join('\n')
        : '🍃'

    const registrationDate = userInfo.registered

    const fullName = displayNameData?.displayName|| user.name
    const secondaryName = userInfo.realName === fullName ? '' : ` (*a.k.a. ${userInfo.realName}*)`

    const daysSinceRegistration = differenceInDays(new Date(), registrationDate)
    const scrobbleRate = daysSinceRegistration > 0
        ? (userInfo.playCount / daysSinceRegistration).toFixed(1)
        : '0'

    const topArtist = topArtists.artists[0]
    const topAlbum = topAlbums.albums[0]
    const topTrack = topTracks.tracks[0]
    const hasPhoto = !!userInfo.images?.[userInfo.images.length - 1]?.url

    ctx.reply(
        'commands:last',
        {
            fullName,
            secondaryName,
            flagEmoji: userInfo.country ? flag(userInfo.country) ?? '🌍' : '🌍',
            scrobbles: userInfo.playCount.toLocaleString('en-US'),
            scrobbleRate,
            topArtist: topArtist?.name || 'Unknown',
            topArtistPlays: topArtist?.playCount.toLocaleString('en-US') || '0',
            topAlbum: topAlbum?.name || 'Unknown',
            topAlbumArtist: topAlbum?.artist.name || 'Unknown',
            topAlbumPlays: topAlbum?.playCount.toLocaleString('en-US') || '0',
            topTrack: topTrack?.name || 'Unknown',
            topTrackArtist: topTrack?.artist.name || 'Unknown',
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
