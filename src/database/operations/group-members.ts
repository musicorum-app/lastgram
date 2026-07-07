import { client } from '../index'
import { error } from '@/logging/logging'

export const addUserToGroupList = async (groupId: string, userId: number) => {
    // ensure the group exists before adding the user to prevent foreign key constraints
    await client.group.upsert({
        where: { id: groupId },
        update: {},
        create: { id: groupId }
    }).catch(() => null)

    return client.groupMember.upsert({
        where: {
            groupId_userId: {
                groupId,
                userId,
            },
        },
        update: {},
        create: {
            groupId,
            userId,
        },
    }).catch((e) => {
        error('graph.addUserToGroupList', e.stack)
        throw e
    })
}