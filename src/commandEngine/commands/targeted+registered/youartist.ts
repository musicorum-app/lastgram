import { Context } from '../../../multiplatformEngine/common/context.js'
import { getNowPlaying } from '../../../fmEngine/completeNowPlaying.js'

export default async (ctx: Context) => {
  const data = await getNowPlaying(ctx, 'artist', true)

  ctx.reply(`commands:youartist`, {
    user: ctx.targetedUser?.name,
    artist: data.artist,
    playCount: data.playCount,
    joinArrays: '\n'
  }, { imageURL: data.imageURL, sendImageAsPhoto: !ctx.targetedUserData?.sendPhotosAsLink })
}

export const info = {
  aliases: ['youart', 'vcart']
}
