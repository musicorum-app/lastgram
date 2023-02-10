import { error, info } from '../loggingEngine/logging.js'

const commands = await import('./commands.js')

// get first cli argument
const arg = process.argv[2]
// @ts-ignore
if (!arg || !commands[arg]) {
  error('cliEngine.main', 'please provide a command to run')
  info('cliEngine.main', `options are: ${Object.keys(commands).join(', ')}`)
}

// @ts-ignore
await commands[arg]?.()