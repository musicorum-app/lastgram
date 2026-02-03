import { Context } from '../../../multiplatforms/common/context.js'
import { client } from '../../../fm'
import { getUserDisplayName } from '../../../database'
import { hashName } from '../../../utils.js'
import { linkArtistNameToMbid, upsertArtistCoverUrl, getTopListenersForArtist } from '../../../database/operations'

type Args = {
    artistName: string
}

type InternalArtistType = { name: string, mbid: string | undefined, imageURL: string | undefined, playCount: number }

export default async (ctx: Context, { artistName }: Args) => {
    let artist: InternalArtistType | undefined = undefined

    if (!artistName) {
        // get now playing and retrieve artist from there
        const data = await client.user.getRecentTracks(ctx.registeredUserData!.fmUsername, { limit: 1 })
        if (!data.tracks[0]) {
            return ctx.reply('commands:globalwhoknows.noScrobbles')
        }
        artist = data.tracks[0].artist as InternalArtistType
    }

    const artObject = await client.getArtistInfo(artist?.name || artistName, ctx.registeredUserData!.fmUsername) as InternalArtistType

    const internalArt = {
        ...artObject,
        name: artist?.name || artObject.name,
        mbid: artist?.mbid || artObject.mbid,
    }

    if (!internalArt.mbid) {
        internalArt.mbid = hashName(internalArt.name)
    }

    await linkArtistNameToMbid(internalArt.name, internalArt.mbid, artObject.imageURL)
    internalArt.imageURL && await upsertArtistCoverUrl(internalArt.mbid, internalArt.name, internalArt.imageURL)

    // Get top listeners for this artist
    const topListeners = await getTopListenersForArtist(internalArt.mbid, 10)

    if (topListeners.length === 0) {
        return ctx.reply('commands:globalwhoknows.noListeners', { artistName: internalArt.name })
    }

    // Get display names for all listeners
    const listenerDetails = await Promise.all(
        topListeners.map(async (listener, index) => {
            const displayName = await getUserDisplayName(listener.fmUsername)
            return {
                position: index + 1,
                name: displayName?.displayName || listener.fmUsername,
                playCount: listener.playCount,
            }
        })
    )

    let listenersText = ''
    for (const listener of listenerDetails) {
        listenersText += ctx.t('commands:globalwhoknows.listener', {
            position: listener.position,
            name: listener.name,
            playCount: listener.playCount,
        }) + '\n'
    }

    return ctx.reply('commands:globalwhoknows.list', {
        artistName: internalArt.name,
        listenerCount: topListeners.length,
        listenersText,
        joinArrays: '\n',
    }, internalArt.imageURL ? { imageURL: internalArt.imageURL, sendImageAsPhoto: true } : undefined)
}

export const info = {
    aliases: ['gwk'],
    args: [{
        name: 'artistName',
        required: false,
        everythingAfter: true
    }],
}
