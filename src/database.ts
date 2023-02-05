import { PrismaClient } from '@prisma/client'
import { info, rainbow } from './loggingEngine/logging.js'

console.trace()
export const client = new PrismaClient()

process.on('exit', (code) => {
  console.trace()
  info('database.main', `process is exiting with code ${code}, disconnecting from database...`)
  info('index.main', rainbow('Goodbye!'))
  return client.$disconnect()
})

export const start = () => {
  info('database.main', 'connecting to database...')
  return client.$connect()
}