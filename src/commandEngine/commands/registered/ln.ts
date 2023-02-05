import { Context } from '../../../multiplatformEngine/common/context.js'
import { client } from '../../../fmEngine/index.js'

export default async (ctx: Context) => {
  const data = await client.user.getRecentTracks<true>(ctx.userData.fmUsername)
  const current = data.tracks[0]
  ctx.reply(`${current.nowPlaying ? 'Now playing' : 'Last played'}: ${current.name} by ${current.artist.name}`)
}

export const info = {
  aliases: ['lt', 'lp', 'listening', 'listen']
}