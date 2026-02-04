import { Context } from '@/multiplatforms/common/context'
import { client } from '@/fm'
import { getUserDisplayName, upsertUserDisplayName } from '@/database'
import { hashName } from '@/utils'
import { addUserToGroupList, linkArtistNameToMbid, upsertArtistCoverUrl } from '../../../database/operations'
import { getCountPastCrownHolders, tryToStealCrown } from '@/database/operations/crowns'

type Args = {
    artistName: string
}
type InternalArtistType = { name: string, mbid: string | undefined, imageURL: string | undefined, playCount: number }

export default async (ctx: Context, { artistName }: Args) => {
    await upsertUserDisplayName(ctx.author.name, ctx.registeredUserData.fmUsername)
    await addUserToGroupList(ctx.channel.id, ctx.registeredUserData.fmUsername)
    let artist: InternalArtistType | undefined = undefined
    if (!artistName) {
        // get now playing and retrieve artist from there
        const data = await client.user.getRecentTracks(ctx.registeredUserData.fmUsername, { limit: 1 })
        if (!data.tracks[0]) {
            return ctx.reply('commands:whoknows.noScrobbles')
        }
        artist = data.tracks[0].artist as InternalArtistType
    }

    const artObject = await client.getArtistInfo(artist?.name || artistName, ctx.registeredUserData.fmUsername) as InternalArtistType
    if (!artObject) {
        return ctx.reply('errors:lastfm.genericError')
    }

    if (artObject.playCount <= 3) return ctx.reply('commands:whoknows.failure', {
        reason: 'noScrobbles',
        artistName: artObject.name,
        joinArrays: ' ',
        pretext: ''
    })
    const internalArt = {
        ...artObject,
        name: artist?.name || artObject.name,
        mbid: artist?.mbid || artObject.mbid,
    }
    if (!internalArt.mbid) internalArt.mbid = hashName(internalArt.name)
    await linkArtistNameToMbid(internalArt.name, internalArt.mbid, artObject.imageURL)
    internalArt.imageURL && await upsertArtistCoverUrl(internalArt.mbid, internalArt.name, internalArt.imageURL)

    // try to take the crown
    const attempt = await tryToStealCrown(ctx.channel.id, internalArt!.mbid!, ctx.registeredUserData.fmUsername.toLowerCase(), artistName, internalArt.playCount)
    const holders = await getCountPastCrownHolders(ctx.channel.id, internalArt.mbid)
    const pastHolders = holders.map((r) => ctx.t('commands:whoknows.pastHolder', {
        name: r.name,
        playCount: r.playCount
    }))
    const currentHolderDisplayName = attempt.crown ? await getUserDisplayName(attempt.crown.fmUsername) : null
    const currentHolder = attempt.crown ? ctx.t('commands:whoknows.currentHolder', {
        name: currentHolderDisplayName?.displayName || 'heheheheheh',
        playCount: attempt.crown.playCount
    }) : undefined

    let pretext = ''
    if (pastHolders[0] || currentHolder) {
        pretext += ctx.t('commands:whoknows.holdersTitle', {
            artistName: internalArt.name,
            playCount: internalArt.playCount
        })
        if (currentHolder) pretext += '\n' + currentHolder + '\n'
        if (pastHolders[0]) pretext += pastHolders.join('\n') + '\n'
        pretext += '\n'
    }

    if (attempt.success) {
        return ctx.reply('commands:whoknows.success', {
            artistName: internalArt.name,
            position: holders.length + 1,
            pretext,
            joinArrays: '\n'
        }, internalArt.imageURL ? { imageURL: internalArt.imageURL, sendImageAsPhoto: true } : undefined)
    } else {
        return ctx.reply('commands:whoknows.failure', {
            artistName: internalArt.name,
            pretext,
            reason: attempt.reason!,
            joinArrays: ' '
        }, internalArt.imageURL ? { imageURL: internalArt.imageURL, sendImageAsPhoto: true } : undefined)
    }
}

export const info = {
    aliases: ['wka', 'coroa', 'crown'],
    args: [{
        name: 'artistName',
        required: false,
        everythingAfter: true
    }],

}
