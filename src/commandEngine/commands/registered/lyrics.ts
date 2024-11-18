import { Context } from '../../../multiplatformEngine/common/context.js'

export default async (ctx: Context) => {
  const args = ctx.args.join(' ')
  if (!args) return ctx.reply('commands:lyrics.noArgs')

  const result = await getLyrics(args)
  console.log(result)
  if (!result?.lyrics) return ctx.reply('commands:lyrics.noResult')

  return ctx.reply('commands:assembledLyrics', {
    title: result.lyrics,
    sourceName:  result.source.name,
    sourceLink: result.source.link
  })
}

export const info = {
  aliases: ['letras', 'letra']
}