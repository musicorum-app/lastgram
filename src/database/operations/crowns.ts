import { EntityType, Prisma } from '@/prisma/client'
import { client } from '../index'
import { getEntityScrobble, upsertEntityScrobble } from './entity-scrobbles'
import { debug, error } from '@/logging/logging'

type CrownWithHolders = Prisma.CrownGetPayload<{ include: { crownHolders: { include: { user: true } } } }>

interface CrownResult {
    success: boolean
    reason?: 'noScrobbles' | 'alreadyHas' | 'notEnough'
    crown?: CrownWithHolders | null
}

const ensureEntityId = async (
    entityType: EntityType, 
    externalId: string, 
    name?: string,
    coverUrl?: string
): Promise<number> => {
    const entity = await client.entity.findUnique({
        where: { type_externalId: { type: entityType, externalId } }
    })
    if (entity) return entity.id

    if (!name) throw new Error(`Entity not found and cannot create without a name string reference.`)
    
    const newEntity = await client.entity.create({
        data: { type: entityType, externalId, name, coverUrl: coverUrl || "" }
    })
    return newEntity.id
}

export const getCrown = async (groupId: string, entityId: number) => {
    return client.crown.findUnique({
        where: {
            groupId_entityId: {
                groupId,
                entityId,
            },
        },
        include: {
            crownHolders: {
                include: {
                    user: true
                }
            }
        }
    })
}

export const checkIfUserHasCrown = async (
    groupId: string,
    userId: number,
    entityType: EntityType,
    externalId: string,
    entityCover?: string,
) => {
    const entity = await client.entity.findUnique({
        where: { type_externalId: { type: entityType, externalId } }
    })
    if (!entity) return false

    const holderRecord = await client.crownHolder.findFirst({
        where: {
            crown: { groupId, entityId: entity.id },
            userId,
            isCurrentHolder: true
        },
    }).catch(() => null)

    if (entityCover) {
        await client.entity.update({
            where: { id: entity.id },
            data: { coverUrl: entityCover },
        }).catch(() => null)
    }

    return !!holderRecord
}

export const getUserCrowns = async (groupId: string, userId: number) => {
    return client.crown.findMany({
        where: {
            groupId,
            crownHolders: {
                some: {
                    userId,
                    isCurrentHolder: true
                }
            }
        },
        include: {
            entity: true,
            crownHolders: {
                where: {
                    userId,
                    isCurrentHolder: true
                },
                take: 1
            }
        }
    })
}

export const createCrown = async (
    groupId: string,
    entityId: number,
    userId: number,
    playCount: number,
) => {
    return client.crown.create({
        data: {
            groupId,
            entityId,
            claimed: true,
            switchedTimes: 0,
            crownHolders: {
                create: {
                    userId,
                    playCount,
                    isCurrentHolder: true
                }
            }
        },
        include: {
            crownHolders: {
                include: {
                    user: true
                }
            }
        }
    })
}

export const updateCrownPlays = async (
    crownId: number,
    userId: number,
    playCount: number,
) => {
    debug(
        'graph.updateCrownPlays',
        `Updating score on crown ${crownId} for user ${userId} to ${playCount}`,
    )

    await client.crownHolder.update({
        where: {
            crownId_userId: {
                crownId,
                userId,
            },
        },
        data: {
            playCount,
            isCurrentHolder: true
        },
    })
}

export const transferCrownOwnership = async (
    crownId: number,
    previousHolderId: number | null,
    newHolderId: number,
    playCount: number,
    currentSwitchedCount: number
) => {
    await client.$transaction([
        client.crown.update({
            where: { id: crownId },
            data: { claimed: true, switchedTimes: currentSwitchedCount + 1 }
        }),
        ...(previousHolderId ? [
            client.crownHolder.update({
                where: { crownId_userId: { crownId, userId: previousHolderId } },
                data: { isCurrentHolder: false }
            })
        ] : []),
        client.crownHolder.upsert({
            where: { crownId_userId: { crownId, userId: newHolderId } },
            update: { playCount, isCurrentHolder: true },
            create: { crownId, userId: newHolderId, playCount, isCurrentHolder: true }
        })
    ]).catch((e) => {
        error('graph.transferCrownOwnership', 'Failed to safely transition crown ownership indices: ' + e.stack)
        throw e
    })
}

export const tryToStealCrown = async (
    groupId: string,
    entityType: EntityType,
    externalId: string,
    userId: number,
    entityName: string,
    playCount: number,
    coverURL: string,
): Promise<CrownResult> => {
    const entityId = await ensureEntityId(entityType, externalId, entityName, coverURL)

    const targetUser = await client.user.findUnique({
        where: { id: userId }
    })
    
    if (!targetUser || !targetUser.lastFmUsername) {
        throw new Error(`Cannot query dynamic scrobble pools for an unlinked database user profile.`)
    }

    const fmUsername = targetUser.lastFmUsername

    // Unconditionally upsert scrobble data so the user appears on the global who knows podiums
    // even if they don't have enough scrobbles to claim the crown.
    await upsertEntityScrobble(fmUsername, entityType, externalId, playCount, entityName, coverURL)
    
    let entityScrobble = await getEntityScrobble(fmUsername, entityType, externalId).catch((e) => {
        error('graph.tryToStealCrown', 'failed to get entity scrobble: ' + e.stack)
        throw e
    })

    const crown = await getCrown(groupId, entityId)
    const currentHolderRecord = crown?.crownHolders.find(h => h.isCurrentHolder)

    if (!entityScrobble || entityScrobble.playCount < 3) {
        return { success: false, reason: 'noScrobbles', crown }
    }

    // Checking if current claimant matches the incoming request
    if (currentHolderRecord && currentHolderRecord.userId === userId) {
        if (playCount > currentHolderRecord.playCount) {
            await updateCrownPlays(crown!.id, userId, entityScrobble.playCount)
        }
        const updatedCrown = await getCrown(groupId, entityId)
        return { success: false, reason: 'alreadyHas', crown: updatedCrown }
    }

    if (!crown) {
        const freshCrown = await createCrown(groupId, entityId, userId, entityScrobble.playCount)
        return { success: true, crown: freshCrown }
    }

    if (currentHolderRecord && entityScrobble.playCount > currentHolderRecord.playCount) {
        // Double-check mechanism: verify the current holder hasn't listened more in the background
        const currentHolderUser = await client.user.findUnique({
            where: { id: currentHolderRecord.userId }
        })

        if (currentHolderUser?.lastFmUsername) {
            const holderScrobble = await getEntityScrobble(currentHolderUser.lastFmUsername, entityType, externalId)
            if (holderScrobble && entityScrobble.playCount <= holderScrobble.playCount) {
                // The current holder actually has more plays now, update their score and deny the steal
                await updateCrownPlays(crown.id, currentHolderRecord.userId, holderScrobble.playCount)
                return { success: false, reason: 'notEnough', crown: await getCrown(groupId, entityId) }
            }
        }

        // Steal successful: transfer the crown
        await transferCrownOwnership(
            crown.id,
            currentHolderRecord.userId,
            userId,
            entityScrobble.playCount,
            crown.switchedTimes
        )

        const crownNow = await getCrown(groupId, entityId)
        return { success: true, crown: crownNow }
    } else {
        return { success: false, reason: 'notEnough', crown }
    }
}

export const getCountPastCrownHolders = async (
    groupId: string,
    entityType: EntityType,
    externalId: string,
) => {
    const entityId = await ensureEntityId(entityType, externalId)

    const crownHolders = await client.crownHolder.findMany({
        where: {
            crown: { groupId, entityId },
            isCurrentHolder: false // Isolates only previous/past log lines
        },
        include: {
            user: true
        }
    })

    return crownHolders.map(holder => ({
        name: holder.user.displayName || holder.user.platformId,
        playCount: holder.playCount
    }))
}

export const getGroupCrownStats = async (groupId: string) => {
    const totalCrowns = await client.crown.count({
        where: { groupId, claimed: true }
    })

    const mostSwitched = await client.crown.findMany({
        where: { groupId, claimed: true, switchedTimes: { gt: 0 } },
        orderBy: { switchedTimes: 'desc' },
        take: 5,
        include: { entity: true }
    })

    const topPlayed = await client.crownHolder.findMany({
        where: {
            isCurrentHolder: true,
            crown: { groupId, claimed: true }
        },
        orderBy: { playCount: 'desc' },
        take: 5,
        include: {
            crown: {
                include: { entity: true }
            },
            user: true
        }
    })

    return { totalCrowns, mostSwitched, topPlayed }
}

export const getUserCrownWorth = async (groupId: string, userId: number) => {
    const aggregate = await client.crownHolder.aggregate({
        where: {
            isCurrentHolder: true,
            userId,
            crown: { groupId, claimed: true }
        },
        _sum: {
            playCount: true
        }
    })

    return aggregate._sum.playCount || 0
}

export const getUnclaimedGroupCrowns = async (groupId: string, fmUsername: string, limit: number = 10) => {
    const rawData = await client.$queryRaw`
        SELECT
            e.id as "entityId",
            e.name as "entityName",
            e.type as "entityType",
            e."coverUrl" as "entityCover",
            es."playCount" as "totalPlays"
        FROM "EntityScrobble" es
        JOIN "Entity" e ON e.id = es."entityId"
        WHERE es."fmUsername" = ${fmUsername}
          AND e.type = 'ARTIST'
          AND NOT EXISTS (
              SELECT 1 FROM "Crown" c
              WHERE c."groupId" = ${groupId}
                AND c."entityId" = e.id
                AND c.claimed = true
          )
        ORDER BY "totalPlays" DESC
        LIMIT ${limit}
    `
    return rawData as any[]
}

export const getUsersWithMostCrowns = async (groupId: string) => {
    const activeHolders = await client.crownHolder.findMany({
        where: {
            crown: { groupId },
            isCurrentHolder: true
        },
        include: {
            user: true
        }
    })

    if (!activeHolders.length) return []

    // Map total accumulation aggregates safely in application space
    const countMap: Record<string, { name: string; score: number }> = {}

    for (const record of activeHolders) {
        const key = `${record.userId}`
        const name = record.user.displayName || record.user.platformId
        if (!countMap[key]) {
            countMap[key] = { name, score: 0 }
        }
        countMap[key].score += 1 // Increment by 1 per crown held
    }

    return Object.values(countMap)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map(user => ({
            name: user.name,
            playCount: user.score
        }))
}