import { Context } from "@/multiplatforms/common/context"
import { getTrackInfo } from "@/fm/epistolares"
import { getGlobalLastgramListeners } from "@/database/operations/entity-scrobbles"
import { EntityType } from "@/prisma/client"
import { getNowPlaying } from "@/fm/completeNowPlaying"

type Args = {
    rawArgs?: string
}

export default async (ctx: Context, { rawArgs }: Args) => {
    const username = ctx.registeredUserData!.lastFmUsername

    let artistName = ""
    let albumName = "" // optional for trackinfo, we can pass empty string if not known
    let trackName = ""

    if (!rawArgs) {
        const nowPlaying = await getNowPlaying(ctx, 'regular', 'track')
        if (!nowPlaying?.artist) return ctx.reply('errors:command.noScrobbles')
        artistName = nowPlaying.artist
        trackName = nowPlaying.name || ""
        albumName = nowPlaying.album || ""
    } else {
        const split = rawArgs.split(' - ')
        if (split.length < 2) return ctx.reply('errors:command.invalidArgument', { usage: '/trackinfo <artist> - <track>' })
        artistName = split[0].trim()
        trackName = split.slice(1).join(' - ').trim()
        albumName = "" // when provided by args, we don't know the album yet
    }

    const data = await getTrackInfo(username, artistName, albumName, trackName)
    if (!data) return ctx.reply('errors:lastfm.genericError') // Could use an "track not found" error later

    const trackInfo = data.track

    const lastgramListeners = await getGlobalLastgramListeners(EntityType.TRACK, trackInfo.id)

    const trackEmoji = trackInfo.userScrobbles?.loved ? ctx.registeredUserData.likedEmoji : "🎵"

    const payload = {
        trackEmoji,
        name: trackInfo.name,
        artist: data.artist.name,
        album: data.album?.name ? `💽 From the album **${data.album.name}**` : "",
        tags: trackInfo.tags.length > 0 ? trackInfo.tags.map(t => `#${t.replace(/ |-/g, '_')}`).join(' ') : "No tags",
        globalListeners: trackInfo.listeners.toLocaleString(),
        globalScrobbles: trackInfo.scrobbles.toLocaleString(),
        lastgramListeners: lastgramListeners.toLocaleString(),
        userScrobbles: trackInfo.userScrobbles?.playCount?.toLocaleString() || "0"
    }

    ctx.reply('commands:trackinfo', payload, {
        sendImageAsPhoto: true,
        imageURL: trackInfo.cover.defaultURL
    })
}

export const info = {
    description: "See information about a track",
    aliases: ['ti', 'tif'],
    args: [{
        name: 'rawArgs',
        required: false,
        everythingAfter: true
    }]
}
