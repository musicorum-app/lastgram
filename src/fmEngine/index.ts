import { LastClient } from '@musicorum/lastfm'
import { LastfmApiMethod } from '@musicorum/lastfm/dist/types/responses.js'
import { error } from '../loggingEngine/logging.js'
import { newHistogram } from '../loggingEngine/metrics.js'
import { backend } from '../cachingEngine/index.js'
import { graphEngine } from '../graphEngine/index.js'

type InternalData = Record<string, any>

interface ReducedArtistInfo {
  name: string
  mbid?: string
  imageURL: string
  playCount: number
}

const lastfmRequest = newHistogram('lastfm_request_duration_seconds', 'Duration of last.fm requests in seconds', ['method', 'code', 'success'])

class LastgramFMClient extends LastClient {
  constructor () {
    super(process.env.FM_API_KEY!, process.env.FM_API_SECRET!, 'lastgram development; @musicorum/lastfm')
  }

  onRequestStarted (method: LastfmApiMethod, params: any, internalData: InternalData) {
    internalData.end = lastfmRequest.startTimer({ method })
  }

  onRequestFinished (method: LastfmApiMethod, params: any, internalData: InternalData, response: any) {
    internalData.end({ success: response.error ? 'false' : 'true', code: response.error ? response.error : 'none' })
    if (response.error && response.error !== 6) {
      error('fmEngine.onRequestFinished', `error while running method ${method} (${response.error}): ${response.message}`)
    }
  }

  async getArtistInfo (artist: string, username: string | undefined): Promise<ReducedArtistInfo | undefined> {
    //const d = !username && await backend?.get(`fm:artist:${artist}`)
    //if (d) return Promise.resolve(JSON.parse(d))
    return this.artist.getInfo(artist, { autocorrect: 1, username }).then(async (data) => {
      const imgIndex = data.images.length - 1
      const reduced: ReducedArtistInfo = {
        name: data.name,
        imageURL: data?.images?.[imgIndex]?.url || undefined,
        mbid: data.mbid,
        playCount: data.user?.playCount || 0
      }

      !username && await backend?.setTTL(`fm:artist:${artist}`, JSON.stringify(reduced), 60 * 60 * 6).catch(() => error('fmEngine.getArtistInfo', `error while caching artist info for ${artist}`))
      return reduced
    })
  }
}

export const client = new LastgramFMClient()
