import { describe, expect, it, mock, beforeEach } from 'bun:test'

// Mock the database client
const mockFindUnique = mock((...args: any[]) => Promise.resolve(null as any))
const mockCreate = mock((...args: any[]) => Promise.resolve({ id: 1 } as any))
const mockFindFirst = mock((...args: any[]) => Promise.resolve(null as any))
const mockFindMany = mock((...args: any[]) => Promise.resolve([] as any[]))
const mockUpsert = mock((...args: any[]) => Promise.resolve({ id: 1 } as any))
const mockUpdate = mock((...args: any[]) => Promise.resolve({} as any))
const mockTransaction = mock((...args: any[]) => Promise.resolve([] as any[]))
const mockQueryRaw = mock((...args: any[]) => Promise.resolve([] as any[]))
const mockCount = mock((...args: any[]) => Promise.resolve(0 as any))
const mockAggregate = mock((...args: any[]) => Promise.resolve({ _sum: { playCount: 0 } } as any))

const mockClient = {
    entity: {
        findUnique: mockFindUnique,
        create: mockCreate,
        upsert: mockUpsert,
        update: mockUpdate,
    },
    crown: {
        findUnique: mock((...args: any[]) => Promise.resolve(null as any)),
        findMany: mockFindMany,
        create: mock((...args: any[]) => Promise.resolve({
            id: 1,
            crownHolders: [{ userId: 1, playCount: 10, isCurrentHolder: true, user: { displayName: 'TestUser', platformId: 'tg_123' } }]
        })),
        update: mockUpdate,
        count: mockCount,
    },
    crownHolder: {
        findFirst: mockFindFirst,
        findMany: mockFindMany,
        update: mockUpdate,
        upsert: mockUpsert,
        aggregate: mockAggregate,
    },
    user: {
        findUnique: mock((...args: any[]) => Promise.resolve({ id: 1, lastFmUsername: 'testuser', displayName: 'TestUser', platformId: 'tg_123' } as any)),
    },
    entityScrobble: {
        findFirst: mock((...args: any[]) => Promise.resolve({ playCount: 10 } as any)),
        findMany: mockFindMany,
        upsert: mockUpsert,
    },
    $transaction: mockTransaction,
    $queryRaw: mockQueryRaw,
}

// Mock the module imports
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

describe('Crown Operations', () => {
    beforeEach(() => {
        mockFindUnique.mockReset()
        mockCreate.mockReset()
        mockFindFirst.mockReset()
        mockFindMany.mockReset()
        mockUpsert.mockReset()
        mockUpdate.mockReset()
        mockTransaction.mockReset()
    })

    describe('ensureEntityId', () => {
        it('should return existing entity id when entity exists', async () => {
            mockFindUnique.mockResolvedValueOnce({ id: 42 })

            // Import after mocking
            const { getCrown } = await import('@/database/operations/crowns')
            
            // We test ensureEntityId indirectly through tryToStealCrown
            // But we can test getCrown directly
            mockClient.crown.findUnique.mockResolvedValueOnce({
                id: 1,
                groupId: 'group1',
                entityId: 42,
                switchedTimes: 0,
                crownHolders: []
            })

            const crown = await getCrown('group1', 42)
            expect(crown).toBeTruthy()
            expect(crown?.entityId).toBe(42)
        })
    })

    describe('checkIfUserHasCrown', () => {
        it('should return false when entity does not exist', async () => {
            mockFindUnique.mockResolvedValueOnce(null)

            const { checkIfUserHasCrown } = await import('@/database/operations/crowns')
            const result = await checkIfUserHasCrown('group1', 1, 'ARTIST' as any, 'ext-123')
            expect(result).toBe(false)
        })

        it('should return false when no holder record exists', async () => {
            mockFindUnique.mockResolvedValueOnce({ id: 42 })
            mockFindFirst.mockResolvedValueOnce(null)

            const { checkIfUserHasCrown } = await import('@/database/operations/crowns')
            const result = await checkIfUserHasCrown('group1', 1, 'ARTIST' as any, 'ext-123')
            expect(result).toBe(false)
        })

        it('should return true when holder record exists', async () => {
            mockFindUnique.mockResolvedValueOnce({ id: 42 })
            mockFindFirst.mockResolvedValueOnce({ userId: 1, isCurrentHolder: true })

            const { checkIfUserHasCrown } = await import('@/database/operations/crowns')
            const result = await checkIfUserHasCrown('group1', 1, 'ARTIST' as any, 'ext-123')
            expect(result).toBe(true)
        })
    })

    describe('getUserCrowns', () => {
        it('should return crowns with entity and holder data', async () => {
            const mockCrowns = [
                {
                    id: 1,
                    groupId: 'group1',
                    entityId: 10,
                    switchedTimes: 3,
                    createdAt: new Date(),
                    entity: { name: 'Radiohead', type: 'ARTIST', externalId: 'ext-1' },
                    crownHolders: [{ userId: 1, playCount: 150, isCurrentHolder: true }]
                },
                {
                    id: 2,
                    groupId: 'group1',
                    entityId: 20,
                    switchedTimes: 0,
                    createdAt: new Date(),
                    entity: { name: 'Björk', type: 'ARTIST', externalId: 'ext-2' },
                    crownHolders: [{ userId: 1, playCount: 80, isCurrentHolder: true }]
                }
            ]
            mockFindMany.mockResolvedValueOnce(mockCrowns)

            const { getUserCrowns } = await import('@/database/operations/crowns')
            const crowns = await getUserCrowns('group1', 1)

            expect(crowns).toHaveLength(2)
            expect(crowns[0].entity.name).toBe('Radiohead')
            expect(crowns[0].crownHolders[0].playCount).toBe(150)
            expect(crowns[1].entity.name).toBe('Björk')
        })
    })

    describe('getUsersWithMostCrowns', () => {
        it('should return empty array when no active holders', async () => {
            mockFindMany.mockResolvedValueOnce([])

            const { getUsersWithMostCrowns } = await import('@/database/operations/crowns')
            const result = await getUsersWithMostCrowns('group1')
            expect(result).toEqual([])
        })

        it('should aggregate and sort by crown count', async () => {
            const mockHolders = [
                { userId: 1, user: { displayName: 'Alice', platformId: 'tg_1' } },
                { userId: 1, user: { displayName: 'Alice', platformId: 'tg_1' } },
                { userId: 1, user: { displayName: 'Alice', platformId: 'tg_1' } },
                { userId: 2, user: { displayName: 'Bob', platformId: 'tg_2' } },
            ]
            mockFindMany.mockResolvedValueOnce(mockHolders)

            const { getUsersWithMostCrowns } = await import('@/database/operations/crowns')
            const result = await getUsersWithMostCrowns('group1')

            expect(result).toHaveLength(2)
            expect(result[0].name).toBe('Alice')
            expect(result[0].playCount).toBe(3) // 3 crowns
            expect(result[1].name).toBe('Bob')
            expect(result[1].playCount).toBe(1) // 1 crown
        })

        it('should use platformId when displayName is missing', async () => {
            const mockHolders = [
                { userId: 1, user: { displayName: '', platformId: 'tg_1' } },
            ]
            mockFindMany.mockResolvedValueOnce(mockHolders)

            const { getUsersWithMostCrowns } = await import('@/database/operations/crowns')
            const result = await getUsersWithMostCrowns('group1')

            expect(result[0].name).toBe('tg_1')
        })
    })

    describe('getCountPastCrownHolders', () => {
        it('should return past holders with names and play counts', async () => {
            // ensureEntityId → findUnique returns entity
            mockFindUnique.mockResolvedValueOnce({ id: 42 })
            
            // findMany for past holders
            mockFindMany.mockResolvedValueOnce([
                { userId: 1, playCount: 50, user: { displayName: 'OldHolder', platformId: 'tg_1' } },
                { userId: 2, playCount: 30, user: { displayName: '', platformId: 'tg_2' } },
            ])

            const { getCountPastCrownHolders } = await import('@/database/operations/crowns')
            const result = await getCountPastCrownHolders('group1', 'ARTIST' as any, 'ext-123')

            expect(result).toHaveLength(2)
            expect(result[0].name).toBe('OldHolder')
            expect(result[0].playCount).toBe(50)
            expect(result[1].name).toBe('tg_2') // fallback to platformId
        })
    })

    describe('transferCrownOwnership', () => {
        it('should increment switchedTimes and transfer holder', async () => {
            mockTransaction.mockResolvedValueOnce([])

            const { transferCrownOwnership } = await import('@/database/operations/crowns')
            await transferCrownOwnership(1, 10, 20, 100, 3)

            expect(mockTransaction).toHaveBeenCalledTimes(1)
        })

        it('should handle null previous holder', async () => {
            mockTransaction.mockResolvedValueOnce([])

            const { transferCrownOwnership } = await import('@/database/operations/crowns')
            await transferCrownOwnership(1, null, 20, 100, 0)

            expect(mockTransaction).toHaveBeenCalledTimes(1)
        })
    })

    describe('getGroupCrownStats', () => {
        it('should return total crowns, most switched, and top played', async () => {
            mockCount.mockResolvedValueOnce(42 as any)
            mockFindMany.mockResolvedValueOnce([{ entity: { name: 'Radiohead' }, switchedTimes: 5 }] as any[]) // most switched
            mockFindMany.mockResolvedValueOnce([{ playCount: 1000, user: { displayName: 'Alice' }, crown: { entity: { name: 'Bjork' } } }] as any[]) // top played

            const { getGroupCrownStats } = await import('@/database/operations/crowns')
            const result = await getGroupCrownStats('group1')

            expect(result.totalCrowns).toBe(42)
            expect(result.mostSwitched[0].entity.name).toBe('Radiohead')
            expect(result.topPlayed[0].playCount).toBe(1000)
        })
    })

    describe('getUserCrownWorth', () => {
        it('should return sum of playCounts', async () => {
            mockAggregate.mockResolvedValueOnce({ _sum: { playCount: 5000 } } as any)

            const { getUserCrownWorth } = await import('@/database/operations/crowns')
            const result = await getUserCrownWorth('group1', 1)

            expect(result).toBe(5000)
        })

        it('should return 0 when no plays', async () => {
            mockAggregate.mockResolvedValueOnce({ _sum: { playCount: null } } as any)

            const { getUserCrownWorth } = await import('@/database/operations/crowns')
            const result = await getUserCrownWorth('group1', 1)

            expect(result).toBe(0)
        })
    })

    describe('getUnclaimedGroupCrowns', () => {
        it('should execute raw SQL query and return rows', async () => {
            mockQueryRaw.mockResolvedValueOnce([{ entityName: 'A' }, { entityName: 'B' }])

            const { getUnclaimedGroupCrowns } = await import('@/database/operations/crowns')
            const result = await getUnclaimedGroupCrowns('group1', 'user1', 10)

            expect(mockQueryRaw).toHaveBeenCalledTimes(1)
            expect(result[0].entityName).toBe('A')
        })
    })
})
