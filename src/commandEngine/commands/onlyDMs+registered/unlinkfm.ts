import { Context } from '../../../multiplatformEngine/common/context.js'
import { updateUserByID } from '../../../database.js'

export default async (ctx: Context) => {
  if (!ctx.userData.sessionKey) {
    ctx.reply('commands:unlinkfm.notLinked')
    return
  }

  await updateUserByID(ctx.userData.id, {
    sessionKey: null
  })
  ctx.reply('commands:unlinkfm.done')
}

export const info = {
  aliases: ['unlinklast']
}
