import { Context } from '../../../multiplatformEngine/common/context.js'
import { getNowPlaying } from '../../../fmEngine/completeNowPlaying.js'

export default async (ctx: Context) => {
  const data = await getNowPlaying(ctx, 'album')

  ctx.reply(`commands:album`, {
    user: ctx.targetedUser?.name ?? ctx.registeredUser!.name,
    isListening: data.isNowPlaying ? 'isPlaying' : 'wasPlaying',
    artist: data.artist,
    album: data.album,
    playCount: data.playCount,
    joinArrays: '\n'
  }, { imageURL: data.imageURL })
}

export const info = {
  aliases: ['alb']
}
