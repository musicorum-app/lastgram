import { Context } from '../../../multiplatformEngine/common/context.js'
import { updateUserByID } from '../../../databaseEngine/index.js'

export default async (ctx: Context) => {
  if (!ctx.guardData.registeredUserData!.sessionKey) {
    ctx.reply('commands:unlinkfm.notLinked')
    return
  }

  await updateUserByID(ctx.guardData.registeredUserData!.id, {
    sessionKey: null
  })
  ctx.reply('commands:unlinkfm.done')
}

export const info = {
  aliases: ['unlinklast']
}
