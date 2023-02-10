import { Context } from '../../../multiplatformEngine/common/context.js'
import { getNowPlaying } from '../../../fmEngine/completeNowPlaying.js'

export default async (ctx: Context) => {
  const data = await getNowPlaying(ctx, 'track')

  ctx.reply(`commands:listening.uh`, {
    userName: ctx.targetedUser!.name,
    trackName: data.name,
    artistName: data.artist,
    scrobbles: data.playCount
  }, { imageURL: data.imageURL })
}

export const info = {
  aliases: ['linkfm']
}
