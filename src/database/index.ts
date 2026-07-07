import { PrismaClient } from '@/prisma/client'
import { debug, info, rainbow } from '@/logging/logging'
import { PrismaPg } from "@prisma/adapter-pg"
import { UserUpdateInput } from '@/prisma/models'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
export const client = new PrismaClient({ adapter })

export const updateUser = (id: string, data: UserUpdateInput) => {
    return client.user.update({
        where: {
            platformId: id
        },
        data
    })
}

export const updateUserByID = (id: number, data: UserUpdateInput) => {
    return client.user.update({
        where: {
            id
        },
        data
    })
}

export const setUserLastFmUsername = async (id: number, username: string) => {
    await client.lastFmUser.upsert({
        where: {
            fmUsername: username.toLowerCase()
        },
        update: {},
        create: {
            fmUsername: username.toLowerCase(),
        },
    })

    return client.user.update({
        where: {
            id
        },
        data: {
            lastFmUsername: username
        }
    })
}

export const getUser = (platformId: string) => {
    return client.user.findUnique({
        where: {
            platformId
        }
    })
}

export const userExists = (platformId: string) => {
    return client.user.count({
        where: {
            platformId
        }
    })
}

process.on('exit', (code) => {
    debug('database.main', `process is exiting with code ${code}, disconnecting from database...`)
    info('index.main', rainbow('Goodbye!'))
    return client.$disconnect()
})

export const start = () => {
    info('database.main', 'connecting to database...')
    return client.$connect()
}
