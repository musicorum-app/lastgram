import { commandRunner } from '../../commands/index.js'
import { Context } from '../common/context.js'

const trashBotEasterEgg = async (data: Record<string, any>) => {
    const ctx = Context.fromTelegramMessage(data, [], commandRunner)
    ctx.reply('🤮 yeah that bot is trash', {}, { noTranslation: true, replyingToOriginal: true })
    return ctx
}

export const handleTelegramMessage = async (botUser: string, data: Record<string, any>): Promise<Context | undefined> => {
    if (data.text.toLowerCase().includes('lastfmplusbot')) return trashBotEasterEgg(data)
    // if the text is "st" or "now", use Math.random() and if its smaller than 15%, run the easter egg
    if (['st', 'now'].includes(data.text.toLowerCase()) && Math.random() < 0.1) return trashBotEasterEgg(data)
    if (!data.text.startsWith('/')) return
    const [name, ...args] = data.text.replace('/', '').replace(`@${botUser}`, '').split(' ')
    if (!commandRunner.hasCommand(name)) return

    const ctx = Context.fromTelegramMessage(data, args || [], commandRunner)
    ctx.setCommand({ name: commandRunner.correctName(name)!, protectionLevel: 'unknown' })
    await commandRunner.runCommand(name, ctx)

    return ctx
}
