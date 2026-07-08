import { Context } from '@/multiplatforms/common/context'
import { getRecentTracks, getArtistInfo } from '@/fm/epistolares'
import { EntityType } from '@/prisma/client'
import { addUserToGroupList } from '@/database/operations'
import { getCountPastCrownHolders, tryToStealCrown } from '@/database/operations/crowns'

type Args = {
    artistName: string
}

export default async (ctx: Context, { artistName }: Args) => {
    await addUserToGroupList(ctx.channel.id, ctx.registeredUserData.id)

    let artistId: string | undefined = undefined
    let resolvedArtistName: string | undefined = undefined
    let imageURL: string | undefined = undefined
    let playCount = 0

    if (!artistName) {
        // get now playing and retrieve artist from there
        const data = await getRecentTracks(ctx.registeredUserData.lastFmUsername, 1)
        if (!data[0]) {
            return ctx.reply('commands:whoknows.noScrobbles')
        }
        artistId = data[0].artist.id
        resolvedArtistName = data[0].artist.name
        imageURL = data[0].artist.cover?.defaultURL
        playCount = data[0].artist.userScrobbles?.playCount || 0
    }

    if (!artistId) {
        const artObject = await getArtistInfo(ctx.registeredUserData.lastFmUsername, artistName)
        if (!artObject) {
            return ctx.reply('errors:lastfm.genericError')
        }
        artistId = artObject.id
        resolvedArtistName = artObject.name
        imageURL = artObject.cover?.defaultURL
        playCount = artObject.userScrobbles?.playCount || 0
    }

    if (playCount <= 3) return ctx.reply('commands:whoknows.failure', {
        reason: 'noScrobbles',
        artistName: resolvedArtistName,
        joinArrays: ' ',
        pretext: ''
    })

    // try to take the crown
    const attempt = await tryToStealCrown(
        ctx.channel.id,
        EntityType.ARTIST,
        artistId,
        ctx.registeredUserData.id,
        resolvedArtistName!,
        playCount,
        imageURL || ''
    )
    const holders = await getCountPastCrownHolders(ctx.channel.id, EntityType.ARTIST, artistId)

    // sort holders by playCount descending
    holders.sort((a, b) => b.playCount - a.playCount)

    const pastHolders = holders.map((r) => ctx.t('commands:whoknows.pastHolder', {
        name: r.name,
        playCount: r.playCount
    }))

    const currentHolder = attempt.crown
        ? (() => {
            const holder = attempt.crown.crownHolders.find(h => h.isCurrentHolder)
            if (!holder) return undefined
            return ctx.t('commands:whoknows.currentHolder', {
                name: holder.user.displayName || holder.user.platformId,
                playCount: holder.playCount
            })
        })()
        : undefined

    let pretext = ''
    if (pastHolders[0] || currentHolder) {
        pretext += ctx.t('commands:whoknows.holdersTitle', {
            artistName: resolvedArtistName,
            playCount
        }) + '\n'
        if (currentHolder) pretext += currentHolder + '\n'
        if (pastHolders[0]) pretext += pastHolders.join('\n') + '\n'
        pretext += '\n'
    }

    if (attempt.success) {
        return ctx.reply('commands:whoknows.success', {
            artistName: resolvedArtistName,
            position: holders.length + 1,
            pretext,
            joinArrays: '\n'
        }, imageURL ? { imageURL, sendImageAsPhoto: true } : undefined)
    } else {
        return ctx.reply('commands:whoknows.failure', {
            artistName: resolvedArtistName,
            pretext,
            reason: attempt.reason!,
            joinArrays: ' '
        }, imageURL ? { imageURL, sendImageAsPhoto: true } : undefined)
    }
}

export const info = {
    description: "See who knows an artist the most in this group",
    aliases: ['wka', 'coroa', 'crown'],
    args: [{
        name: 'artistName',
        required: false,
        everythingAfter: true
    }],

}
