import { Context } from '../../../multiplatformEngine/common/context.js'
import { graphEngine } from '../../../graphEngine/index.js'

type Args = {
  artistName: string
}
type InternalArtistType = { name: string, mbid: string | undefined, imageURL: string | undefined, playCount: number }

export default async (ctx: Context) => {
  const username = ctx.targetedUserData?.fmUsername ?? ctx.registeredUserData!.fmUsername
  const displayName = ctx.targetedUser?.name ?? ctx.registeredUser!.name

  const crowns = await graphEngine.getUserCrowns(ctx.channel.id, username).then((r) => {
    if (!r?.length) return undefined
    return r.sort((a: any, b: any) => b.createdat - a.createdat)
  })
  const crownCount = crowns?.length || 0

  if (crownCount === 0) {
    return ctx.reply('commands:crowns.noCrowns', { displayName })
  }

  // sort by createdAt
  const artistNames = await Promise.all(crowns.map((c: any) => graphEngine.getArtistNameByMbid(c.artistmbid)))
  let crownsText = ''
  for (let i = 0; i < crownCount; i++) {
    const crown = crowns[i]
    crownsText += ctx.t('commands:crowns.crown', {
      position: i + 1,
      artistName: artistNames[i],
      playCount: crown.playcount,
      count: crown.switchedtimes
    }) + '\n'
  }

  return ctx.reply('commands:crowns.list', {
    displayName,
    groupName: ctx.channel.name,
    crownsText,
    joinArrays: '\n'
  })
}

export const info = {
  aliases: ['crws', 'coroas']
}
