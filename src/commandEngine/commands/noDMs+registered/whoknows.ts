import { Context } from '../../../multiplatformEngine/common/context.js'
import { fixLanguageFormat } from '../../helpers.js'
import { client } from '../../../fmEngine/index.js'
import { getUser, upsertUserDisplayName } from '../../../databaseEngine/index.js'
import { graphEngine } from '../../../graphEngine/index.js'
import { hashName } from '../../../utils.js'

type Args = {
  artist: string
}

export default async (ctx: Context, { artistName }: Args) => {
  await graphEngine.addMemberToGroupList(ctx.channel.id, ctx.registeredUserData.fmUsername)
  const artist = await client.getArtistInfo(artistName)
  if (!artist) {
    ctx.reply('commands:whoknows.notFound', { artist })
    return
  }
  if (!artist.mbid) artist.mbid = hashName(artist.name)

  // try to take the crown
  const attempt = await graphEngine.tryToStealCrown(ctx.channel.id, artist.mbid, ctx.registeredUserData.fmUsername)
  if (attempt) {
    ctx.reply('commands:whoknows.success', { artist })
    return
  } else {
    ctx.reply('commands:whoknows.failure', { artist })
    return
  }
}

export const info = {
  aliases: ['wk', 'coroa', 'crown'],
  args: [{
    name: 'artistName',
    required: true,
    everythingAfter: true
  }]
}
