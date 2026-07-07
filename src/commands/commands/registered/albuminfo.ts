import { Context } from "@/multiplatforms/common/context"
import { getAlbumInfo } from "@/fm/epistolares"
import { getGlobalLastgramListeners } from "@/database/operations/entity-scrobbles"
import { EntityType } from "@/prisma/client"
import { getNowPlaying } from "@/fm/completeNowPlaying"

type Args = {
    rawArgs?: string
}

export default async (ctx: Context, { rawArgs }: Args) => {
    const username = ctx.registeredUserData!.lastFmUsername

    let artistName = ""
    let albumName = ""

    if (!rawArgs) {
        const nowPlaying = await getNowPlaying(ctx, 'regular', 'album')
        if (!nowPlaying?.artist) return ctx.reply('errors:command.noScrobbles')
        if (!nowPlaying.album) return ctx.reply('errors:lastfm.genericError') // generic error if no album is scrobbled
        artistName = nowPlaying.artist
        albumName = nowPlaying.album
    } else {
        const split = rawArgs.split(' - ')
        if (split.length < 2) return ctx.reply('errors:command.invalidArgument', { usage: '/albuminfo <artist> - <album>' })
        artistName = split[0].trim()
        albumName = split.slice(1).join(' - ').trim()
    }

    const albumInfo = await getAlbumInfo(username, artistName, albumName)
    if (!albumInfo) return ctx.reply('errors:lastfm.genericError') // Could use an "album not found" error later

    const lastgramListeners = await getGlobalLastgramListeners(EntityType.ALBUM, albumInfo.id)

    const payload = {
        name: albumInfo.name,
        artist: albumInfo.artist,
        tags: albumInfo.tags.length > 0 ? albumInfo.tags.map(t => `#${t.replace(/ |-/g, '_')}`).join(' ') : "No tags",
        globalListeners: albumInfo.listeners.toLocaleString(),
        globalScrobbles: albumInfo.scrobbles.toLocaleString(),
        lastgramListeners: lastgramListeners.toLocaleString(),
        userScrobbles: albumInfo.userScrobbles?.playCount?.toLocaleString() || "0",
        tracksCount: albumInfo.tracks.length
    }

    ctx.reply('commands:albuminfo', payload, {
        sendImageAsPhoto: true,
        imageURL: albumInfo.cover.defaultURL
    })
}

export const info = {
    aliases: ['ali', 'alif'],
    args: [{
        name: 'rawArgs',
        required: false,
        everythingAfter: true
    }]
}
