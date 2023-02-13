import { Context } from '../../../multiplatformEngine/common/context.js'
import { getNowPlaying } from '../../../fmEngine/completeNowPlaying.js'

export default async (ctx: Context) => {
  const data = await getNowPlaying(ctx, 'track', true)

  ctx.reply(`commands:youtrack`, {
    user: ctx.targetedUser?.name,
    track: data.name,
    artist: data.artist,
    album: data.album,
    playCount: data.playCount,
    emoji: data.loved ? '💗' : '🎵',
    joinArrays: '\n'
  }, { imageURL: data.imageURL })
}

export const info = {
  aliases: ['you']
}
