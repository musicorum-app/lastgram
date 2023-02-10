import { client } from './index.js'
import { NoScrobblesError } from '../commandEngine/errors.js'
import { Context } from '../multiplatformEngine/common/context.js'
import { LastfmRecentTracksTrack } from '@musicorum/lastfm/dist/types/packages/user.js'
import { LastfmTag } from '@musicorum/lastfm/dist/types/packages/common.js'
import { debug } from '../loggingEngine/logging.js'

export type NowPlayingEntity = 'artist' | 'album' | 'track'

export interface NowPlayingData<NowPlayingEntity> {
  name: string
  imageURL: string
  artist?: string
  playCount?: number
  loved: boolean
  tags?: string[]
  isNowPlaying: boolean
}

const entityCall = (entity: NowPlayingEntity, username: string, track: LastfmRecentTracksTrack) => {
  const data = { username }

  switch (entity) {
    case 'artist':
      return client.artist.getInfo(track.artist.name, data)
    case 'album':
      return client.album.getInfo(track.album.name, track.artist.name, data)
    case 'track':
      return client.track.getInfo(track.name, track.artist.name, data)
    default:
      throw new Error('Invalid entity')
  }
}

export const getNowPlaying = async (ctx: Context, entity: NowPlayingEntity): Promise<NowPlayingData<NowPlayingEntity>> => {
  debug('fmEngine.getNowPlaying', `getting now playing for ${ctx.targetedUser!.name} (fm username is ${ctx.userData.fmUsername})`)
  const nowPlaying = await client.user.getRecentTracks(ctx.userData.fmUsername, { limit: 1 })

  const track = nowPlaying.tracks[0]
  if (!track) {
    throw new NoScrobblesError(ctx)
  }

  const info = await entityCall(entity, ctx.userData.fmUsername, track)

  return {
    name: track.name,
    imageURL: track.images[3].url,
    artist: entity === 'artist' ? undefined : track.artist.name,
    playCount: info.user!.playCount,
    loved: info.user!.loved,
    tags: info.tags?.map?.((tag: LastfmTag) => tag.name ?? tag),
    isNowPlaying: track.isNowPlaying
  }
}