import { Context } from "@/multiplatforms/common/context"
import { getArtistInfo } from "@/fm/epistolares"
import { getGlobalLastgramListeners } from "@/database/operations/entity-scrobbles"
import { EntityType } from "@/prisma/client"
import { getNowPlaying } from "@/fm/completeNowPlaying"

type Args = {
    artistName?: string
}

export default async (ctx: Context, { artistName }: Args) => {
    const username = ctx.registeredUserData!.lastFmUsername

    if (!artistName) {
        const nowPlaying = await getNowPlaying(ctx, 'regular', 'artist')
        if (!nowPlaying?.artist) return ctx.reply('errors:command.noScrobbles')
        artistName = nowPlaying.artist
    }

    const artistInfo = await getArtistInfo(username, artistName)
    if (!artistInfo) return ctx.reply('errors:lastfm.userNotFound') // Note: Epistolares may return artist not found, but we can reuse a generic or specific error

    const lastgramListeners = await getGlobalLastgramListeners(EntityType.ARTIST, artistInfo.id)

    const payload = {
        name: artistInfo.name,
        tags: artistInfo.tags.length > 0 ? artistInfo.tags.map(t => `#${t.replace(/ |-/g, '_')}`).join(' ') : "No tags",
        similar: artistInfo.similarArtists.length > 0 ? artistInfo.similarArtists.map(a => a.name).join(', ') : "None",
        globalListeners: artistInfo.listeners.toLocaleString(),
        globalScrobbles: artistInfo.scrobbles.toLocaleString(),
        lastgramListeners: lastgramListeners.toLocaleString(),
        userScrobbles: artistInfo.userScrobbles?.playCount?.toLocaleString() || "0",
        bio: artistInfo.bio?.summary || "No bio available.",
    }

    ctx.reply('commands:artistinfo', payload, {
        sendImageAsPhoto: true,
        imageURL: artistInfo.cover.defaultURL
    })
}

export const info = {
    aliases: ['ai', 'aif'],
    args: [{
        name: 'artistName',
        required: false,
        everythingAfter: true
    }]
}
