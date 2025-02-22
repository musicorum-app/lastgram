import { Context } from '../../../multiplatformEngine/common/context.js'
import { getNowPlaying } from '../../../fmEngine/completeNowPlaying.js'

export default async (ctx: Context) => {
  const data = await getNowPlaying(ctx, 'track')

  ctx.reply(`commands:listening`, {
    user: ctx.targetedUser?.name ?? ctx.registeredUser!.name,
    isListening: data.isNowPlaying ? 'isPlaying' : 'wasPlaying',
    track: data.name,
    artist: data.artist,
    album: data.album,
    playCount: data.playCount,
    emoji: data.loved ? '💗' : '🎵',
    joinArrays: '\n'
  }, { imageURL: data.imageURL, sendImageAsPhoto: !ctx.registeredUserData.sendPhotosAsLink })
}

export const info = {
  aliases: ['lt', 'ln', 'lp', 'pl', 'pt', 'listening', 'listen']
}
