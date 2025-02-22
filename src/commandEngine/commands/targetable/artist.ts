import { Context } from '../../../multiplatformEngine/common/context.js'
import { getNowPlaying } from '../../../fmEngine/completeNowPlaying.js'
import { graphEngine } from '../../../graphEngine/index.js'
import { warn } from '../../../loggingEngine/logging.js'

export default async (ctx: Context) => {
  const data = await getNowPlaying(ctx, 'artist')

  if (!data.mbid) warn('commands.artist', `no mbid found for ${data.artist}`)
  if (data.playCount && data.playCount > 1 && data.mbid) await graphEngine.upsertScrobbles(ctx.registeredUserData.fmUsername, data.mbid, data.playCount)
  ctx.reply(`commands:artist`, {
    user: ctx.targetedUser?.name ?? ctx.registeredUser!.name,
    isListening: data.isNowPlaying ? 'isPlaying' : 'wasPlaying',
    artist: data.artist,
    playCount: data.playCount,
    joinArrays: '\n'
  }, { imageURL: data.imageURL, sendImageAsPhoto: !ctx.registeredUserData.sendPhotosAsLink })
}

export const info = {
  aliases: ['art']
}
