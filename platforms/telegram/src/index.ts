import '@lastgram/core/env.js'
import { Lastgram } from '@lastgram/core/dist/structures/Lastgram.js'
import { DesperadoClient } from './desperado/Desperado.js'
import { Message } from './desperado/types/Message.js'

const core = new Lastgram()
const client = new DesperadoClient(process.env.TELEGRAM_TOKEN)

client.on('message', async (msg: Message) => {
  if (msg.from.is_bot) return undefined

  const parsedCmd = client.utils.parseArgs(msg.text)
  if (!parsedCmd) return undefined

  const cmd = await core.findCommandByName(parsedCmd.commandName)
  if (!cmd) return undefined

  const ctx = core.utils.buildCtx(
    'tg',
    msg.message_id.toString(),
    msg.text,
    parsedCmd.args,
    {
      firstName: msg.from.first_name,
      lastName: msg.from.last_name,
      id: msg.from.id.toString(),
      languageCode: msg.from.language_code
    },
    { name: msg.chat.title, id: msg.chat.id.toString() }
  )

  const r = await cmd.execute(ctx)

  return client.sendMessage(
    msg.chat.id,
    r as string,
    msg.reply_to_message ? msg.message_id : null
  )
})

client.startPolling()
