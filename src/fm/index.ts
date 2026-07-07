import { LastClient } from '@musicorum/lastfm'
import { LastfmApiMethod } from '@musicorum/lastfm/dist/types/responses.js'
import { error } from '@/logging/logging'
import { newHistogram } from '@/logging/metrics'
import { backend } from '@/caching'

type InternalData = Record<string, any>

interface ReducedArtistInfo {
    name: string
    mbid?: string
    imageURL: string | undefined
    playCount: number
}

const lastfmRequest = newHistogram('lastfm_request_duration_seconds', 'Duration of last.fm requests in seconds', ['method', 'code', 'success'])

class LastgramFMClient extends LastClient {
    constructor() {
        super(process.env.FM_API_KEY!, process.env.FM_API_SECRET!, 'lastgram development; @musicorum/lastfm')
    }

    onRequestStarted(method: LastfmApiMethod, _params: any, internalData: InternalData) {
        internalData.end = lastfmRequest.startTimer({ method })
    }

    onRequestFinished(method: LastfmApiMethod, _params: any, internalData: InternalData, response: any) {
        internalData.end({ success: response.error ? 'false' : 'true', code: response.error ? response.error : 'none' })
        if (response.error && response.error !== 6) {
            error('fm.onRequestFinished', `error while running method ${method} (${response.error}): ${response.message}`)
        }
    }
}

export const client = new LastgramFMClient()

