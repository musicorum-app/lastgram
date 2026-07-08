import { EntityType } from '@/prisma/client'
import { client } from '../index'
import { error } from '@/logging/logging'

export const upsertEntityScrobble = async (
    fmUsername: string,
    entityType: EntityType,
    externalId: string,
    playCount: number,
    entityName: string,
    coverURL: string
) => {
    const entity = await client.entity.upsert({
        where: {
            type_externalId: {
                type: entityType,
                externalId,
            },
        },
        update: {},
        create: {
            type: entityType,
            externalId,
            name: entityName,
            coverUrl: coverURL,
        },
    }).catch((e) => {
        error('graph.upsertEntityScrobble.ensureEntity', e.stack)
        throw e
    })

    return client.entityScrobble.upsert({
        where: {
            fmUsername_entityId: {
                fmUsername,
                entityId: entity.id,
            },
        },
        update: {
            playCount,
        },
        create: {
            fmUsername,
            entityId: entity.id,
            playCount,
        },
    }).catch((e) => {
        error('graph.upsertEntityScrobble', e.stack)
        throw e
    })
}

export const getEntityScrobble = async (
    fmUsername: string,
    entityType: EntityType,
    externalId: string
) => {
    return client.entityScrobble.findFirst({
        where: {
            fmUsername,
            entity: {
                type: entityType,
                externalId
            }
        },
    })
}

export const getTopListenersForEntity = async (
    entityType: EntityType,
    externalId: string,
    limit = 10
) => {
    return client.entityScrobble.findMany({
        where: {
            entity: {
                type: entityType,
                externalId
            }
        },
        orderBy: {
            playCount: 'desc',
        },
        take: limit,
        include: {
            lastFmUser: {
                include: {
                    users: {
                        select: {
                            displayName: true,
                            platformId: true
                        }
                    }
                }
            }
        }
    })
}

export const getGlobalLastgramListeners = async (
    entityType: EntityType,
    externalId: string
) => {
    return client.entityScrobble.count({
        where: {
            entity: {
                type: entityType,
                externalId
            },
            playCount: { gt: 0 },
            lastFmUser: {
                users: {
                    some: {}
                }
            }
        }
    })
}