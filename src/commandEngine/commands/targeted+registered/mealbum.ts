import { Context } from '../../../multiplatformEngine/common/context.js'
import { getNowPlaying } from '../../../fmEngine/completeNowPlaying.js'

export default async (ctx: Context) => {
  const data = await getNowPlaying(ctx, 'album', false, true)

  ctx.reply(`commands:mealbum`, {
    user: ctx.targetedUser?.name,
    artist: data.artist,
    album: data.album,
    playCount: data.playCount,
    joinArrays: '\n'
  }, { imageURL: data.imageURL })
}

export const info = {
  aliases: ['mealb', 'eualb']
}
