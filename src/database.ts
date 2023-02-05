import { PrismaClient } from '@prisma/client'
import { info, rainbow } from './loggingEngine/logging.js'

export const client = new PrismaClient()

process.on('exit', () => {
  info('database.main', 'process is exiting, disconnecting from database...')
  info('index.main', rainbow('Goodbye!'))
  return client.$disconnect()
})