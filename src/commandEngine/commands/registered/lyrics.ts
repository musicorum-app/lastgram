import { Context } from '../../../multiplatformEngine/common/context.js'
import { findLyrics } from '../../../lyricsEngine/index.js'
import { getNowPlaying } from '../../../fmEngine/completeNowPlaying.js'

export default async (ctx: Context) => {
  let args = ctx.args.join(' ')
  if (!args) {
    const data = await getNowPlaying(ctx, 'track')
    if (!data.isNowPlaying) return ctx.reply('commands:lyrics.noArgs')
    args = `${data.artist} - ${data.name}`
  }

  const rawArtistTrack = args.split('-').map((r) => r.trim())
  if (rawArtistTrack.length < 2) return ctx.reply('commands:lyrics.invalidArgs')

  const [artist, track] = rawArtistTrack

  const result = await findLyrics(track, artist)

  if (!result?.lyrics) return ctx.reply('commands:lyrics.noResult')
  if (result.instrumental) return ctx.reply('commands:lyrics.instrumental')

  return ctx.reply('commands:assembledLyrics', {
    lyrics: result.lyrics,
    artist: result.artistName,
    track: result.trackName,
    joinArrays: '\n'
  })
}

export const info = {
  aliases: ['letras', 'letra']
}