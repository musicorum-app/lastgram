import { PrismaClient } from '../prisma-client/index.js'
import { Logger } from '@lastgram/logging'

const prisma = new PrismaClient()

interface User {
  platform: string
  platformId: string
  username: string
}

export class Database {
  createUser(user: User) {
    return prisma.user.create({
      data: {
        platformId: `${user.platform}${user.platformId}`,
        preferences: { create: {} },
        account: {
          create: {
            username: user.username
          }
        }
      }
    })
  }

  findUser(platform: string, id: string) {
    return prisma.user.findUnique({
      where: {
        platformId: `${platform}${id}`
      },
      include: {
        preferences: true,
        account: true
      }
    })
  }
}

process.on('exit', async (code) => {
  Logger.showStopper('Lastgram', 'Process is leaving, running cleanup tasks.')
  await prisma.$disconnect()
  Logger.showStopper('Lastgram', 'Leaving now. Bye.')
  process.exit(code)
})
