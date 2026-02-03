import { client } from '../index'
import { error } from '../../logging/logging'

export const upsertArtistScrobbles = async (fmUsername: string, artistMbid: string, playCount: number, artistName: string, coverURL?: string) => {
    // Ensure artist exists first
    await client.artist.upsert({
        where: {
            mbid: artistMbid,
        },
        update: {},
        create: {
            mbid: artistMbid,
            name: artistName,
            coverUrl: coverURL,
        },
    }).catch((e) => {
        error('graph.upsertArtistScrobbles.ensureArtist', e.stack)
        throw e
    })

    return client.artistScrobble.upsert({
        where: {
            fmUsername_artistId: {
                fmUsername: fmUsername.toLowerCase(),
                artistId: artistMbid,
            },
        },
        update: {
            playCount,
        },
        create: {
            fmUsername: fmUsername.toLowerCase(),
            artistId: artistMbid,
            playCount,
        },
    }).catch((e) => {
        error('graph.upsertArtistScrobble', e.stack)
        throw e
    })
}

export const getArtistScrobble = async (fmUsername: string, artistMbid: string) => {
    //debug('graph.getArtistScrobble', `getting artist scrobble for ${fmUsername} on ${artistMbid}`)

    return client.artistScrobble.findUnique({
        where: {
            fmUsername_artistId: {
                fmUsername: fmUsername.toLowerCase(),
                artistId: artistMbid,
            },
        },
    })
}

export const getTopListenersForArtist = async (artistMbid: string, limit: number = 10) => {
    return client.artistScrobble.findMany({
        where: {
            artistId: artistMbid,
        },
        orderBy: {
            playCount: 'desc',
        },
        take: limit,
    })
}

