import { client } from '../index'
import { error } from '@/logging/logging'

export const addUserToGroupList = async (groupId: string, fmUsername: string) => {
    return client.groupMember.upsert({
        where: {
            groupId_fmUsername: {
                groupId,
                fmUsername: fmUsername.toLowerCase(),
            },
        },
        update: {},
        create: {
            groupId,
            fmUsername: fmUsername.toLowerCase(),
        },
    }).catch((e) => {
        error('graph.addUserToGroupList', e.stack)
        throw e
    })
}
