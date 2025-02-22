import { PrismaClient } from '@prisma/client'
import { debug, info, rainbow } from '../loggingEngine/logging.js'

export const client = new PrismaClient()

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
  return client.fmDisplayName.findUnique({
    where: {
      fmUsername
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
      fmUsername: username
    },
    where: {
      fmUsername: username
    }
  })
}

process.on('exit', (code) => {
  debug('databaseEngine.main', `process is exiting with code ${code}, disconnecting from database...`)
  info('index.main', rainbow('Goodbye!'))
  return client.$disconnect()
})

export const start = () => {
  info('databaseEngine.main', 'connecting to database...')
  return client.$connect()
}
