import { LastClient } from '@musicorum/lastfm'
import { LastfmApiMethod } from '@musicorum/lastfm/dist/types/responses.js'
import { error } from '../loggingEngine/logging.js'
import { newHistogram } from '../loggingEngine/metrics.js'

type InternalData = Record<string, any>

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
}

export const client = new LastgramFMClient()
