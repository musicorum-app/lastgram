import { client } from './index.js'
import { NoScrobblesError } from '../commandEngine/errors.js'
import { Context } from '../multiplatformEngine/common/context.js'
import { LastfmRecentTracksTrack } from '@musicorum/lastfm/dist/types/packages/user.js'
import { LastfmTag } from '@musicorum/lastfm/dist/types/packages/common.js'
import { debug } from '../loggingEngine/logging.js'
import { hashName } from '../utils.js'
import { upsertArtistScrobbles } from '../graphEngine/operations/artist-scrobbles.js'

export type NowPlayingEntity = 'artist' | 'album' | 'track'

export interface NowPlayingData<NowPlayingEntity> {
  name: string
  mbid: string
  artistMbid: string
  imageURL: string
  artist?: string
  album?: string
  playCount?: number
  loved: boolean
  tags: string[]
  isNowPlaying: boolean
}

const entityCall = async (entity: NowPlayingEntity, username: string, track: LastfmRecentTracksTrack) => {
  const data = { username }

  switch (entity) {
    case 'artist':
      const d = await client.artist.getInfo(track.artist.name, data)
      if (d?.playCount && d?.playCount > 1 && d?.mbid) await upsertArtistScrobbles(username, d?.mbid, d?.playCount)
      return d
    case 'album':
      return client.album.getInfo(track.album.name, track.artist.name, data)
    case 'track':
      return client.track.getInfo(track.name, track.artist.name, data)
    default:
      throw new Error('Invalid entity')
  }
}

export const getNowPlaying = async (ctx: Context, entity: NowPlayingEntity, getFromRegisteredUserForTargeted?: boolean, informationForRegistered?: boolean): Promise<NowPlayingData<NowPlayingEntity>> => {
  const targetUserData = ctx.targetedUserData ?? ctx.registeredUserData
  const targetUser = ctx.targetedUser ?? ctx.registeredUser

  debug('fmEngine.getNowPlaying', `getting now playing for ${targetUser.name} (fm username is ${targetUserData.fmUsername})`)
  const nowPlaying = await client.user.getRecentTracks(getFromRegisteredUserForTargeted ? ctx.registeredUserData.fmUsername : targetUserData.fmUsername, { limit: 1 })

  const track = nowPlaying.tracks[0]
  if (!track) {
    throw new NoScrobblesError(ctx)
  }

  const info = await entityCall(
    entity,
    informationForRegistered ? ctx.registeredUserData.fmUsername : targetUserData.fmUsername,
    track
  ).catch(() => undefined)

  let tags = info?.tags?.map?.((tag: LastfmTag) => tag.name ?? tag) || []
  tags = tags.map((a: string) => a.toLowerCase().replaceAll('-', '_').replaceAll(' ', '_'))

  let artistMbid
  if (entity === 'track' || entity === 'album') {
    artistMbid = track.artist.mbid || hashName(track.artist.name)
  } else {
    artistMbid = info?.mbid
  }

  return {
    name: track.name,
    mbid: info.mbid || hashName(track.name),
    artistMbid,
    imageURL: info.images?.[3]?.url || track?.images?.[3]?.url,
    artist: track.artist.name,
    album: track.album.name || info.album?.name,
    playCount: info.user?.playCount || 0,
    loved: info.user?.loved || false,
    tags: tags.slice(0, 5),
    isNowPlaying: track.nowPlaying || false
  }
}

