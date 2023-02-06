import { Context } from '../../../multiplatformEngine/common/context.js'
import { client } from '../../../fmEngine/index.js'

export default async (ctx: Context) => {
  const data = await client.user.getRecentTracks<true>(ctx.userData.fmUsername)
  const current = data.tracks[0]

  ctx.reply(`**{{userName}}** is listening to **{{trackName}}** by **{{artistName}}**`, {
    userName: ctx.author.name,
    trackName: current.name,
    artistName: current.artist.name
  }, { imageURL: current.images[3].url })
}

export const info = {
  aliases: ['lt', 'lp', 'listening', 'listen'],
  description: 'Shows what you are currently listening to.'
}