import type { Crown } from '@/prisma/client'
import { getArtistScrobble, upsertArtistScrobbles, } from './artist-scrobbles'
import { debug, error } from '@/logging/logging'
import { client, getUserDisplayName } from '../index'

interface PastCrownHolder {
    name: string
    playCount: number
}

interface CrownResult {
    success: boolean
    reason?: string
    crown?: Crown | null
}

interface UserWithMostCrowns {
    name: string
    playCount: number
}

export const getCrown = async (groupId: string, artistMbid: string) => {
    return client.crown.findUnique({
        where: {
            groupId_artistId: {
                groupId,
                artistId: artistMbid,
            },
        },
    })
}

export const checkIfUserHasCrown = async (
    groupId: string,
    fmUsername: string,
    artistMbid: string,
    artistCover?: string,
) => {
    const crown = await client.crown.findFirst({
        where: {
            groupId,
            fmUsername: fmUsername.toLowerCase(),
            artistId: artistMbid,
        },
    }).catch(() => null)

    if (artistCover) {
        client.artist.update({
            where: {
                mbid: artistMbid,
            },
            data: {
                coverUrl: artistCover,
            },
        }).then(() => null).catch(() => null)
    }

    return !!crown
}
export const getUserCrowns = async (groupId: string, fmUsername: string) => {
    return client.crown.findMany({
        where: {
            groupId,
            fmUsername: fmUsername.toLowerCase(),
        },
    })
}

export const createCrown = async (
    groupId: string,
    artistMbid: string,
    fmUsername: string,
    playCount: number,
) => {
    return client.crown.create({
        data: {
            groupId,
            artistId: artistMbid,
            fmUsername: fmUsername.toLowerCase(),
            playCount,
            switchedTimes: 0,
        },
    })
}

export const updateCrownPlays = async (
    groupId: string,
    artistMbid: string,
    fmUsername: string,
    playCount: number,
) => {
    debug(
        'graph.upsertCrown',
        `updating crown for ${groupId} on ${artistMbid} with ${fmUsername} and ${playCount}`,
    )

    await client.crown.update({
        where: {
            groupId_artistId: {
                groupId,
                artistId: artistMbid,
            },
        },
        data: {
            playCount,
        },
    })
}

export const transferCrownOwnership = async (
    crown: Crown,
    fmUsername: string,
    playCount: number,
) => {
    await client.crown
        .update({
            where: {
                groupId_artistId: {
                    groupId: crown.groupId,
                    artistId: crown.artistId,
                },
            },
            data: {
                fmUsername: fmUsername.toLowerCase(),
                playCount,
                switchedTimes: crown.switchedTimes + 1,
            },
        })
        .catch((e) => {
            error('graph.tryGetToCrown', 'failed to update crown: ' + e.stack)
            throw e
        })
}

export const appendToPastCrownHolders = async (
    groupId: string,
    artistMbid: string,
    fmUsername: string,
    playCount: number,
) => {
    return client.crownHolder.create({
        data: {
            groupId,
            artistId: artistMbid,
            fmUsername: fmUsername.toLowerCase(),
            playCount,
        },
    })
}

export const tryToStealCrown = async (
    groupId: string,
    artistMbid: string,
    fmUsername: string,
    artistName: string,
    playCount: number,
): Promise<CrownResult> => {
    // first, we must get the fmUser's artist scrobble
    let artistScrobble = await getArtistScrobble(fmUsername, artistMbid).catch(
        (e) => {
            error(
                'graph.tryGetToCrown',
                'failed to get artist scrobble: ' + e.stack,
            )
            throw e
        },
    )

    // now, we compare the artist scrobble's playCount to the crown's playCount
    const crown = await getCrown(groupId, artistMbid).catch((e) => {
        error('graph.tryGetToCrown', 'failed to get crown: ' + e.stack)
        throw e
    })

    if ((!artistScrobble || artistScrobble.playCount < 3) && playCount < 3) {
        return { success: false, reason: 'noScrobbles', crown }
    } else {
        await upsertArtistScrobbles(fmUsername, artistMbid, playCount, artistName)
        artistScrobble = await getArtistScrobble(fmUsername, artistMbid)
        if (!artistScrobble) {
            return { success: false, reason: 'noScrobbles', crown }
        }
    }

    // if the username is the same as the crown's, we just update the play count
    if (crown && crown.fmUsername.toLowerCase() === fmUsername.toLowerCase()) {
        if (!crown.playCount || playCount > crown.playCount)
            await updateCrownPlays(
                groupId,
                artistMbid,
                fmUsername,
                artistScrobble.playCount,
            )
        return { success: false, reason: 'alreadyHas', crown }
    }

    if (!crown) {
        // if it doesn't exist, the user can get the crown
        await createCrown(
            groupId,
            artistMbid,
            fmUsername,
            artistScrobble.playCount,
        )
        return { success: true }
    }

    if (artistScrobble.playCount > crown.playCount) {
        // now, just to be sure, we get the artistscrobbleid from the crown and check if it's still less than fmUser's playCount
        const artistScrobbleFromCrown = await getArtistScrobble(
            crown.fmUsername,
            artistMbid,
        ).catch((e) => {
            error(
                'graph.tryGetToCrown',
                'failed to get artist scrobble from crown: ' + e.stack,
            )
            throw e
        })

        if (!artistScrobbleFromCrown || artistScrobble.playCount > artistScrobbleFromCrown.playCount) {
            // if it is, we give the crown to the other user
            await transferCrownOwnership(crown, fmUsername, artistScrobble.playCount)

            await appendToPastCrownHolders(
                groupId,
                artistMbid,
                crown.fmUsername,
                crown.playCount,
            ).catch((e) => {
                error(
                    'graph.tryGetToCrown',
                    'failed to append to past crown holders: ' + e.stack,
                )
                throw e
            })

            const crownNow = await getCrown(groupId, artistMbid).catch((e) => {
                error('graph.tryGetToCrown', 'failed to get crown: ' + e.stack)
                throw e
            })

            return { success: true, crown: crownNow }
        } else {
            // if it's not, we update the play count
            await updateCrownPlays(
                groupId,
                artistMbid,
                fmUsername,
                artistScrobble.playCount,
            )
            return { success: false, reason: 'notEnough', crown }
        }
    } else {
        return { success: false, reason: 'notEnough', crown }
    }
}

export const getCountPastCrownHolders = async (
    groupId: string,
    artistMbid: string,
) => {
    const crownHolders = await client.crownHolder.findMany({
        where: {
            groupId,
            artistId: artistMbid,
        },
        select: {
            fmUsername: true,
            playCount: true,
        },
    })

    if (!crownHolders || crownHolders.length === 0) return []

    const holders: PastCrownHolder[] = await Promise.all(
        crownHolders.map(async (holder) => {
            const name = await getUserDisplayName(holder.fmUsername)
            return { name: name?.displayName || holder.fmUsername, playCount: holder.playCount }
        }),
    )

    return holders
}

export const getUsersWithMostCrowns = async (groupId: string) => {
    // Get all crown holders for the group, grouped by username with their total play count
    const crownHolders = await client.crownHolder.groupBy({
        by: ['fmUsername'],
        where: {
            groupId,
        },
        _sum: {
            playCount: true,
        },
        orderBy: {
            _sum: {
                playCount: 'desc',
            },
        },
        take: 10,
    })

    if (!crownHolders || crownHolders.length === 0) return []

    const users: UserWithMostCrowns[] = await Promise.all(
        crownHolders.map(async (holder) => {
            const name = (await getUserDisplayName(holder.fmUsername)) || {
                displayName: holder.fmUsername,
            }
            return { name: name.displayName, playCount: holder._sum.playCount || 0 }
        }),
    )

    return users
}
