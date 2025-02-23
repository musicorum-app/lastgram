import { Context } from '../../../multiplatformEngine/common/context.js'
import { getNowPlaying } from '../../../fmEngine/completeNowPlaying.js'

export default async (ctx: Context) => {
  const data = await getNowPlaying(ctx, 'album', true)

  ctx.reply(`commands:youalbum`, {
    user: JSON.stringify(ctx.targetedUser?.name),
    artist: data.artist,
    album: data.album,
    playCount: data.playCount,
    joinArrays: '\n',
    tags: ctx.targetedUserData.sendTags ? `\n*${data.tags.map(a => `#${a}`).join(' ')}*` : ''
  }, { imageURL: data.imageURL, sendImageAsPhoto: !ctx.targetedUserData?.sendPhotosAsLink })
}

export const info = {
  aliases: ['youalb', 'vcalb']
}
