import { Context } from '../../../multiplatformEngine/common/context.js'
import { getNowPlaying } from '../../../fmEngine/completeNowPlaying.js'

export default async (ctx: Context) => {
  const data = await getNowPlaying(ctx, 'artist', false, true)

  ctx.reply(`commands:meartist`, {
    user: ctx.targetedUser?.name,
    artist: data.artist,
    playCount: data.playCount,
    joinArrays: '\n'
  }, { imageURL: data.imageURL })
}

export const info = {
  aliases: ['meart', 'euart']
}
