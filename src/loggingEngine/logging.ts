// @ts-ignore
import { isWorkerThread } from 'piscina'
import { threadId } from 'node:worker_threads'
import { isDevelopment } from '../utils.js'

const reset = '\x1b[0m'
const grey = '\x1b[90m'
const italics = '\x1b[3m'
const green = '\x1b[32m'
const royalBlue = '\x1b[38;5;21m'

const log = (level: string, asciiColor: string, scope: string, message: string) => {
  const date = new Date()
  // hh:mm:ss format
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  const thread = isWorkerThread ? `${royalBlue}worker ${threadId}` : `${green}main`
  console.log(`${grey}${time}${reset} ${thread}${reset} ${asciiColor}[${level}]${reset} (${italics}${scope}${reset}): ${message}`)
}

const pad = (str: number, length = 2) => {
  return '0'.repeat(length - str.toString().length) + str
}
export const info = (scope: string, message: string) => log('INFO', '\x1b[32m', scope, message)
export const warn = (scope: string, message: string) => log('WARN', '\x1b[33m', scope, message)
export const error = (scope: string, message: string) => log('ERROR', '\x1b[31m', scope, message)
export const debug = (scope: string, message: string) => isDevelopment && log('DEBUG', '\x1b[36m', scope, message)

export const bold = (str: string) => `\x1b[1m${str}${reset}`
export const italic = (str: string) => `\x1b[3m${str}${reset}`
export const underline = (str: string) => `\x1b[4m${str}${reset}`
export const strikethrough = (str: string) => `\x1b[9m${str}${reset}`

export const rainbow = (str: string) => {
  const colors = ['\x1b[31m', '\x1b[33m', '\x1b[32m', '\x1b[36m', '\x1b[34m', '\x1b[35m']
  let result = ''
  for (let i = 0; i < str.length; i++) {
    result += colors[i % colors.length] + str[i]
  }
  return result + reset
}