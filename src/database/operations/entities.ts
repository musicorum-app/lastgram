import { client } from '../index'
import { error } from '@/logging/logging'
import { EntityType } from '@/prisma/client'

export const linkEntity = async (
    entityType: EntityType,
    entityName: string,
    externalId: string,
    photoUrl: string
) => {
    return client.entity.upsert({
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
            coverUrl: photoUrl,
        },
    }).catch((e) => {
        error('graph.linkEntity', e.stack)
        throw e
    })
}

export const getEntityDataByExternalId = async (
    entityType: EntityType,
    externalId: string
) => {
    const entity = await client.entity.findUnique({
        where: {
            type_externalId: {
                type: entityType,
                externalId,
            },
        },
        select: {
            name: true,
            coverUrl: true,
        },
    }).catch((e) => {
        error('graph.getEntityDataByExternalId', e.stack + ' ' + externalId)
        throw e
    })

    return { name: entity?.name, cover: entity?.coverUrl }
}

export const upsertEntityCoverUrl = async (
    entityType: EntityType,
    externalId: string,
    entityName: string,
    coverUrl: string
) => {
    return client.entity.upsert({
        where: {
            type_externalId: {
                type: entityType,
                externalId,
            },
        },
        update: {
            coverUrl,
        },
        create: {
            type: entityType,
            externalId,
            name: entityName,
            coverUrl,
        },
    })
}