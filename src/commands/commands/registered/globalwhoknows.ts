import { Context } from '@/multiplatforms/common/context'
import { getRecentTracks, getArtistInfo } from '@/fm/epistolares'
import { EntityType } from '@/prisma/client'
import { linkEntity, upsertEntityCoverUrl } from '@/database/operations'
import { getTopListenersForEntity } from '@/database/operations/entity-scrobbles'

type Args = {
    artistName: string
}

export default async (ctx: Context, { artistName }: Args) => {
    let artistId: string | undefined = undefined
    let resolvedArtistName: string | undefined = undefined
    let imageURL: string | undefined = undefined

    if (!artistName) {
        // get now playing and retrieve artist from there
        const data = await getRecentTracks(ctx.registeredUserData!.lastFmUsername, 1)
        if (!data[0]) {
            return ctx.reply('commands:globalwhoknows.noScrobbles')
        }
        artistId = data[0].artist.id
        resolvedArtistName = data[0].artist.name
        imageURL = data[0].artist.cover?.defaultURL
    }

    if (!artistId) {
        const artObject = await getArtistInfo(ctx.registeredUserData!.lastFmUsername, artistName)
        if (!artObject) return ctx.reply('errors:lastfm.genericError')
        artistId = artObject.id
        resolvedArtistName = artObject.name
        imageURL = artObject.cover?.defaultURL
    }

    await linkEntity(EntityType.ARTIST, resolvedArtistName!, artistId, imageURL || '')
    if (imageURL) await upsertEntityCoverUrl(EntityType.ARTIST, artistId, resolvedArtistName!, imageURL)

    // get top listeners for this artist
    const topListeners = await getTopListenersForEntity(EntityType.ARTIST, artistId, 10)

    if (topListeners.length === 0) {
        return ctx.reply('commands:globalwhoknows.noListeners', { artistName: resolvedArtistName })
    }

    // Get display names for all listeners
    const listenerDetails = topListeners.map((listener, index) => {
        const user = listener.lastFmUser.users[0]
        return {
            position: index + 1,
            name: user?.displayName || user?.platformId || listener.fmUsername,
            playCount: listener.playCount,
        }
    })

    let listenersText = ''
    for (const listener of listenerDetails) {
        listenersText += ctx.t('commands:globalwhoknows.listener', {
            position: listener.position,
            name: listener.name,
            playCount: listener.playCount,
        }) + '\n'
    }

    return ctx.reply('commands:globalwhoknows.list', {
        artistName: resolvedArtistName,
        listenerCount: topListeners.length,
        listenersText,
        joinArrays: '\n',
    }, imageURL ? { imageURL, sendImageAsPhoto: true } : undefined)
}

export const info = {
    aliases: ['gwk'],
    args: [{
        name: 'artistName',
        required: false,
        everythingAfter: true
    }],
}
