import { Context } from '../../../multiplatformEngine/common/context.js'
import { getNowPlaying } from '../../../fmEngine/completeNowPlaying.js'

export default async (ctx: Context) => {
  const data = await getNowPlaying(ctx, 'album')
  const user = ctx.targetedUser ?? ctx.registeredUser
  const userData = ctx.targetedUserData ?? ctx.registeredUserData

  ctx.reply(`commands:album`, {
    user: user.name,
    isListening: data.isNowPlaying ? 'isPlaying' : 'wasPlaying',
    artist: data.artist,
    album: data.album,
    playCount: data.playCount,
    joinArrays: '\n',
    tags: userData.sendTags ? `\n*${data.tags.map(a => `#${a}`).join(' ')}*` : '',
  }, { imageURL: data.imageURL, sendImageAsPhoto: !userData.sendPhotosAsLink })
}

export const info = {
  aliases: ['alb']
}
