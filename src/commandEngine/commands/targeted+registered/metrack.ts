import { Context } from '../../../multiplatformEngine/common/context.js'
import { getNowPlaying } from '../../../fmEngine/completeNowPlaying.js'

export default async (ctx: Context) => {
  const data = await getNowPlaying(ctx, 'track', false, true)

  ctx.reply(`commands:youtrack`, {
    user: JSON.stringify(ctx.targetedUser?.name),
    track: data.name,
    artist: data.artist,
    album: data.album,
    playCount: data.playCount,
    tags: ctx.registeredUserData.sendTags ? `\n*${data.tags.map(a => `#${a}`).join(' ')}*` : '',
    emoji: data.loved ? ctx.registeredUserData.likedEmoji : '🎵',
    joinArrays: '\n'
  }, { imageURL: data.imageURL, sendImageAsPhoto: !ctx.registeredUserData?.sendPhotosAsLink })
}

export const info = {
  aliases: ['me', 'eu']
}
