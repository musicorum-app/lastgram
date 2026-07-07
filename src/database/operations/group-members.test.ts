import { describe, expect, it, mock, beforeEach } from 'bun:test'

// Mock the database client
const mockGroupMemberUpsert = mock((...args: any[]) => Promise.resolve({ id: 1, groupId: 'g1', userId: 42 } as any))
const mockGroupUpsert = mock((...args: any[]) => Promise.resolve({ id: 'g1' } as any))

const mockClient = {
    groupMember: {
        upsert: mockGroupMemberUpsert,
    },
    group: {
        upsert: mockGroupUpsert,
    }
}

mock.module('@/database/index', () => ({
    client: mockClient,
}))

mock.module('@/logging/logging', () => ({
    debug: () => {},
    error: () => {},
    info: () => {},
}))

describe('Group Member Operations', () => {
    beforeEach(() => {
        mockGroupMemberUpsert.mockClear()
        mockGroupUpsert.mockClear()
    })

    describe('addUserToGroupList', () => {
        it('should ensure group exists then upsert group member', async () => {
            const { addUserToGroupList } = await import('@/database/operations/group-members')
            
            mockGroupUpsert.mockResolvedValueOnce({ id: 'g123' } as any)
            mockGroupMemberUpsert.mockResolvedValueOnce({ id: 1, groupId: 'g123', userId: 42 } as any)

            const result = await addUserToGroupList('g123', 42)

            expect(result).toBeTruthy()
            expect(mockGroupUpsert).toHaveBeenCalledTimes(1)
            expect(mockGroupMemberUpsert).toHaveBeenCalledTimes(1)

            const groupUpsertCall = (mockGroupUpsert.mock.calls[0] as any[])[0]
            expect(groupUpsertCall.where.id).toBe('g123')
            expect(groupUpsertCall.create.id).toBe('g123')

            const upsertCall = (mockGroupMemberUpsert.mock.calls[0] as any[])[0]
            
            // Should link the user and group
            expect(upsertCall.create.groupId).toBe('g123')
            expect(upsertCall.create.userId).toBe(42)
            expect(upsertCall.where.groupId_userId.groupId).toBe('g123')
            expect(upsertCall.where.groupId_userId.userId).toBe(42)
        })

        it('should throw and log error if upsert fails', async () => {
            const { addUserToGroupList } = await import('@/database/operations/group-members')
            
            mockGroupMemberUpsert.mockRejectedValueOnce(new Error('Prisma Error'))

            await expect(addUserToGroupList('g123', 42)).rejects.toThrow('Prisma Error')
            expect(mockGroupMemberUpsert).toHaveBeenCalledTimes(1)
        })
    })
})
