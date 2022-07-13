import { PrismaClient } from './prisma-client'
import { Logger } from '@lastgram/logging'

const prisma = new PrismaClient()

export class Database {
  constructor() {
    process.on('exit', async (code) => {
      Logger.showStopper(
        'Lastgram',
        'Process is leaving, running cleanup tasks.'
      )
      await prisma.$disconnect()
      Logger.showStopper('Lastgram', 'Leaving now. Bye.')
      process.exit(code)
    })
  }

  createUser(user) {
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

  findUser(platform, id) {
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
