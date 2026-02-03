import { client } from '../index'
import { error } from '../../logging/logging'
import { hashName } from '../../utils'

export const linkArtistNameToMbid = async (artistName: string, artistMbid: string | undefined, photoUrl: string | undefined) => {
    const mbid = artistMbid || hashName(artistName)

    return client.artist.upsert({
        where: {
            mbid,
        },
        update: {},
        create: {
            mbid,
            name: artistName,
            coverUrl: photoUrl,
        },
    }).catch((e) => {
        error('graph.linkArtistNameToMbid', e.stack)
        throw e
    })
}

export const getArtistDataByMbid = async (artistMbid: string) => {
    const artist = await client.artist.findUnique({
        where: {
            mbid: artistMbid,
        },
        select: {
            name: true,
            coverUrl: true,
        },
    }).catch((e) => {
        error('graph.getArtistNameFromMbid', e.stack + ' ' + artistMbid)
        throw e
    })

    return { name: artist?.name, cover: artist?.coverUrl }
}

export const upsertArtistCoverUrl = async (artistMbid: string, artistName: string, coverUrl: string) => {
    return client.artist.upsert({
        where: {
            mbid: artistMbid,
        },
        update: {
            coverUrl,
        },
        create: {
            mbid: artistMbid,
            name: artistName,
            coverUrl,
        },
    })
}
