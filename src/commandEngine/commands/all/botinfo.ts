import { Context } from '../../../multiplatformEngine/common/context.js'
import client from 'prom-client'
import { isDevelopment } from '../../../utils.js'
import { CommandButtonComponentType } from '../../../multiplatformEngine/common/components/button.js'

export default async (ctx: Context) => {
  const processMemory = process.memoryUsage()
  const rss = processMemory.rss / 1024 / 1024
  const heapTotal = processMemory.heapTotal / 1024 / 1024
  const heapUsed = processMemory.heapUsed / 1024 / 1024
  const totalTelegramMessages = await client.register.getSingleMetricAsString(isDevelopment ? 'lg_dev_platform_telegram_total_handled_messages' : 'lg_platform_telegram_total_handled_messages').then((s) => {
    const v = s.split(' ')
    return v[v.length - 1]
  })

  ctx.components.newGroup((b) => {
    b.addButton({
      name: 'commands:botinfo.buttons.github',
      emoji: '👀',
      url: 'https://github.com/musicorum-app/lastgram',
      type: CommandButtonComponentType.link
    })
  })

  ctx.reply('commands:botinfo.data', {
    mode: isDevelopment ? 'development' : 'stable',
    rss: rss.toFixed(2),
    heapTotal: heapTotal.toFixed(2),
    heapUsed: heapUsed.toFixed(2),
    updates: totalTelegramMessages
  })
}

export const info = {
  aliases: ['lastgraminfo'],
  description: 'Shows information about the bot.'
}
