import { Context } from '../../../multiplatformEngine/common/context.js'
import client from 'prom-client'
import { isDevelopment } from '../../../utils.js'

export default async (ctx: Context) => {
  const processMemory = process.memoryUsage()
  const rss = processMemory.rss / 1024 / 1024
  const heapTotal = processMemory.heapTotal / 1024 / 1024
  const heapUsed = processMemory.heapUsed / 1024 / 1024
  const totalTelegramMessages = await client.register.getSingleMetricAsString(isDevelopment ? 'lg_dev_platform_telegram_total_handled_messages' : 'lg_platform_telegram_total_handled_messages').then((s) => {
    const v = s.split(' ')
    return v[v.length - 1]
  })

  ctx.reply('lastgram {{mode}}\n💻 **Memory usage:** {{rss}} MB (RSS), {{heapTotal}} MB (heap total), {{heapUsed}} MB (heap used)\n📩 **{{updates}}** messages from Telegram since last restar', {
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