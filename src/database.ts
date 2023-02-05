import { PrismaClient } from '@prisma/client'
import { info, rainbow } from './loggingEngine/logging.js'

export const client = new PrismaClient()

process.on('exit', (code) => {
  info('databaseEngine.main', `process is exiting with code ${code}, disconnecting from database...`)
  info('index.main', rainbow('Goodbye!'))
  return client.$disconnect()
})

export const start = () => {
  info('databaseEngine.main', 'connecting to database...')
  return client.$connect()
}