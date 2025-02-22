import { Context } from '../../../multiplatformEngine/common/context.js'
import { getNowPlaying } from '../../../fmEngine/completeNowPlaying.js'

export default async (ctx: Context) => {
  const data = await getNowPlaying(ctx, 'track')
  const user = ctx.targetedUser ?? ctx.registeredUser
  const userData = ctx.targetedUserData ?? ctx.registeredUserData

  ctx.reply(`commands:listening`, {
    user: user.name,
    isListening: data.isNowPlaying ? 'isPlaying' : 'wasPlaying',
    track: data.name,
    artist: data.artist,
    album: data.album,
    playCount: data.playCount,
    emoji: data.loved ? userData.likedEmoji : '🎵',
    tags: userData.sendTags ? `\n*${data.tags.map(a => `#${a}`).join(' ')}*` : '',
    joinArrays: '\n'
  }, { imageURL: data.imageURL, sendImageAsPhoto: !userData.sendPhotosAsLink })
}

export const info = {
  aliases: ['lt', 'ln', 'lp', 'pl', 'pt', 'listening', 'listen']
}
