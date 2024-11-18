import { Context } from '../../../multiplatformEngine/common/context.js'
import { getNowPlaying } from '../../../fmEngine/completeNowPlaying.js'

export default async (ctx: Context) => {
  const data = await getNowPlaying(ctx, 'album', true)

  ctx.reply(`commands:youalbum`, {
    user: ctx.targetedUser?.name,
    artist: data.artist,
    album: data.album,
    playCount: data.playCount,
    joinArrays: '\n'
  }, { imageURL: data.imageURL })
}

export const info = {
  aliases: ['youalb', 'vcalb']
}
