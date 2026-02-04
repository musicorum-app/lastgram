import { error, info } from '@/logging/logging'

const commands = await import('./commands.js')

// get first cli argument
const arg = process.argv[2]
// @ts-ignore
if (!arg || !commands[arg]) {
    error('cli.main', 'please provide a command to run')
    info('cli.main', `options are: ${Object.keys(commands).join(', ')}`)
}

// @ts-ignore
await commands[arg]?.()
