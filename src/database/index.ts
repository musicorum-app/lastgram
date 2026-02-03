import { PrismaClient } from '../prisma/client'
import { debug, info, rainbow } from '../logging/logging.js'
import { PrismaPg } from "@prisma/adapter-pg"

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
export const client = new PrismaClient({ adapter })

export const updateUser = (id: string, data: any) => {
    return client.user.update({
        where: {
            platformId: id
        },
        data
    })
}

export const updateUserByID = (id: number, data: any) => {
    return client.user.update({
        where: {
            id
        },
        data
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

export const getUserDisplayName = (fmUsername: string) => {
    return client.fmDisplayName.findFirst({
        where: {
            fmUsername: {
                equals: fmUsername,
                mode: 'insensitive'
            }
        }
    })
}

export const upsertUserDisplayName = (displayName: string, username: string) => {
    return client.fmDisplayName.upsert({
        update: {
            displayName
        },
        create: {
            displayName,
            fmUsername: username.toLowerCase()
        },
        where: {
            fmUsername: username.toLowerCase()
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
