import { commandRunner } from '../../commandEngine/index.js'
import { Context } from '../common/context.js'

export const handleTelegramMessage = async (botUser: string, data: Record<string, any>): Promise<Context | undefined> => {
  if (!data.text.startsWith('/')) return
  const [name, ...args] = data.text.replace('/', '').replace(`@${botUser}`, '').split(' ')
  if (!commandRunner.hasCommand(name)) return

  const ctx = Context.fromTelegramMessage(data, args || [], commandRunner)
  ctx.setCommand({ name: commandRunner.correctName(name)!, protectionLevel: 'unknown' })
  await commandRunner.runCommand(name, ctx)

  return ctx
}
