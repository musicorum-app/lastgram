import { describe, expect, it, mock, beforeEach } from 'bun:test'

// Mock the database client
const mockEntityFindUnique = mock((...args: any[]) => Promise.resolve(null as any))
const mockEntityUpsert = mock((...args: any[]) => Promise.resolve({ id: 1, externalId: 'ext-1', name: 'TestEntity', type: 'ARTIST' } as any))
const mockEntityUpdate = mock((...args: any[]) => Promise.resolve({} as any))

const mockScrobbleFindFirst = mock((...args: any[]) => Promise.resolve(null as any))
const mockScrobbleFindMany = mock((...args: any[]) => Promise.resolve([] as any[]))
const mockScrobbleUpsert = mock((...args: any[]) => Promise.resolve({ id: 1, playCount: 50 } as any))

const mockClient = {
    entity: {
        findUnique: mockEntityFindUnique,
        upsert: mockEntityUpsert,
        update: mockEntityUpdate,
    },
    entityScrobble: {
        findFirst: mockScrobbleFindFirst,
        findMany: mockScrobbleFindMany,
        upsert: mockScrobbleUpsert,
    },
}

mock.module('@/database/index', () => ({
    client: mockClient,
}))

mock.module('@/database', () => ({
    client: mockClient,
}))

mock.module('@/logging/logging', () => ({
    debug: () => {},
    error: () => {},
    info: () => {},
}))

mock.module('@/prisma/client', () => ({
    EntityType: {
        ARTIST: 'ARTIST',
        ALBUM: 'ALBUM',
        TRACK: 'TRACK',
    },
    Prisma: {},
}))

describe('Entity Operations', () => {
    beforeEach(() => {
        mockEntityFindUnique.mockReset()
        mockEntityUpsert.mockReset()
        mockEntityUpdate.mockReset()
    })

    describe('linkEntity', () => {
        it('should upsert entity with externalId', async () => {
            mockEntityUpsert.mockResolvedValueOnce({
                id: 1,
                externalId: 'ext-123',
                name: 'Radiohead',
                type: 'ARTIST',
                coverUrl: 'https://example.com/cover.jpg'
            })

            const { linkEntity } = await import('@/database/operations/entities')
            const result = await linkEntity('ARTIST' as any, 'Radiohead', 'ext-123', 'https://example.com/cover.jpg')

            expect(result).toBeTruthy()
            expect(mockEntityUpsert).toHaveBeenCalledTimes(1)

            const upsertCall = (mockEntityUpsert.mock.calls[0] as any[])[0]
            expect(upsertCall.where.type_externalId.externalId).toBe('ext-123')
            expect(upsertCall.where.type_externalId.type).toBe('ARTIST')
            expect(upsertCall.create.externalId).toBe('ext-123')
            expect(upsertCall.create.name).toBe('Radiohead')
        })
    })

    describe('getEntityDataByExternalId', () => {
        it('should find entity by type and externalId', async () => {
            mockEntityFindUnique.mockResolvedValueOnce({
                name: 'Radiohead',
                coverUrl: 'https://example.com/cover.jpg'
            })

            const { getEntityDataByExternalId } = await import('@/database/operations/entities')
            const result = await getEntityDataByExternalId('ARTIST' as any, 'ext-123')

            expect(result.name).toBe('Radiohead')
            expect(result.cover).toBe('https://example.com/cover.jpg')

            const findCall = (mockEntityFindUnique.mock.calls[0] as any[])[0]
            expect(findCall.where.type_externalId.externalId).toBe('ext-123')
        })

        it('should return undefined name/cover when entity not found', async () => {
            mockEntityFindUnique.mockResolvedValueOnce(null)

            const { getEntityDataByExternalId } = await import('@/database/operations/entities')
            const result = await getEntityDataByExternalId('ARTIST' as any, 'nonexistent')

            expect(result.name).toBeUndefined()
            expect(result.cover).toBeUndefined()
        })
    })

    describe('upsertEntityCoverUrl', () => {
        it('should upsert entity with new cover URL', async () => {
            mockEntityUpsert.mockResolvedValueOnce({ id: 1 })

            const { upsertEntityCoverUrl } = await import('@/database/operations/entities')
            await upsertEntityCoverUrl('ARTIST' as any, 'ext-123', 'Radiohead', 'https://new-cover.jpg')

            const upsertCall = (mockEntityUpsert.mock.calls[0] as any[])[0]
            expect(upsertCall.update.coverUrl).toBe('https://new-cover.jpg')
            expect(upsertCall.create.coverUrl).toBe('https://new-cover.jpg')
        })
    })
})

describe('Entity Scrobble Operations', () => {
    beforeEach(() => {
        mockScrobbleFindFirst.mockReset()
        mockScrobbleFindMany.mockReset()
        mockScrobbleUpsert.mockReset()
        mockEntityUpsert.mockReset()
    })

    describe('upsertEntityScrobble', () => {
        it('should ensure entity exists then upsert scrobble', async () => {
            mockEntityUpsert.mockResolvedValueOnce({ id: 42 })
            mockScrobbleUpsert.mockResolvedValueOnce({ id: 1, playCount: 100 })

            const { upsertEntityScrobble } = await import('@/database/operations/entity-scrobbles')
            const result = await upsertEntityScrobble(
                'TestUser', 'ARTIST' as any, 'ext-123', 100, 'Radiohead', 'https://cover.jpg'
            )

            expect(result.playCount).toBe(100)
            expect(mockEntityUpsert).toHaveBeenCalledTimes(1)

            // Verify entity upsert uses externalId
            const entityCall = (mockEntityUpsert.mock.calls[0] as any[])[0]
            expect(entityCall.where.type_externalId.externalId).toBe('ext-123')
            expect(entityCall.create.coverUrl).toBe('https://cover.jpg')
        })

        it('should NOT lowercase fmUsername to preserve foreign key', async () => {
            mockEntityUpsert.mockResolvedValueOnce({ id: 42 })
            mockScrobbleUpsert.mockResolvedValueOnce({ id: 1, playCount: 50 })

            const { upsertEntityScrobble } = await import('@/database/operations/entity-scrobbles')
            await upsertEntityScrobble(
                'MixedCaseUser', 'ARTIST' as any, 'ext-123', 50, 'Artist', 'https://cover.jpg'
            )

            const scrobbleCall = (mockScrobbleUpsert.mock.calls[0] as any[])[0]
            expect(scrobbleCall.where.fmUsername_entityId.fmUsername).toBe('MixedCaseUser')
            expect(scrobbleCall.create.fmUsername).toBe('MixedCaseUser')
        })
    })

    describe('getEntityScrobble', () => {
        it('should find scrobble by username and entity external ID', async () => {
            mockScrobbleFindFirst.mockResolvedValueOnce({ playCount: 75 })

            const { getEntityScrobble } = await import('@/database/operations/entity-scrobbles')
            const result = await getEntityScrobble('testuser', 'ARTIST' as any, 'ext-123')

            expect(result?.playCount).toBe(75)

            const findCall = (mockScrobbleFindFirst.mock.calls[0] as any[])[0]
            expect(findCall.where.fmUsername).toBe('testuser')
            expect(findCall.where.entity.externalId).toBe('ext-123')
        })

        it('should NOT lowercase fmUsername when searching', async () => {
            mockScrobbleFindFirst.mockResolvedValueOnce(null)

            const { getEntityScrobble } = await import('@/database/operations/entity-scrobbles')
            await getEntityScrobble('TestUser', 'ALBUM' as any, 'ext-456')

            const findCall = (mockScrobbleFindFirst.mock.calls[0] as any[])[0]
            expect(findCall.where.fmUsername).toBe('TestUser')
        })
    })

    describe('getTopListenersForEntity', () => {
        it('should return top listeners ordered by playCount desc', async () => {
            const mockListeners = [
                {
                    fmUsername: 'user1',
                    playCount: 200,
                    lastFmUser: {
                        users: [{ displayName: 'User One', platformId: 'tg_1' }]
                    }
                },
                {
                    fmUsername: 'user2',
                    playCount: 100,
                    lastFmUser: {
                        users: [{ displayName: 'User Two', platformId: 'tg_2' }]
                    }
                }
            ]
            mockScrobbleFindMany.mockResolvedValueOnce(mockListeners)

            const { getTopListenersForEntity } = await import('@/database/operations/entity-scrobbles')
            const result = await getTopListenersForEntity('ARTIST' as any, 'ext-123', 10)

            expect(result).toHaveLength(2)
            expect(result[0].playCount).toBe(200)
            expect(result[0].lastFmUser.users[0].displayName).toBe('User One')
        })

        it('should use default limit of 10', async () => {
            mockScrobbleFindMany.mockResolvedValueOnce([])

            const { getTopListenersForEntity } = await import('@/database/operations/entity-scrobbles')
            await getTopListenersForEntity('ARTIST' as any, 'ext-123')

            const findCall = (mockScrobbleFindMany.mock.calls[0] as any[])[0]
            expect(findCall.take).toBe(10)
        })
    })
})
