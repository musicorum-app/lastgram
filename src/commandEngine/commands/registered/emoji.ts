import { Context } from '../../../multiplatformEngine/common/context.js'
import { updateUserByID } from '../../../databaseEngine/index.js'

type Args = {
  emoji: string
}
const regexExp = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
export default async (ctx: Context, { emoji }: Args) => {
  // check if emoji is valid
  const match = emoji.match(regexExp)
  if (!match) {
    ctx.reply(`commands:emoji.invalid`)
    return
  }

  await updateUserByID(ctx.registeredUserData.id, { likedEmoji: emoji })
  ctx.reply(`commands:emoji.done`, { emoji })
}

export const info = {
  aliases: ['em'],
  args: [{
    name: 'emoji',
    required: true
  }]
}
