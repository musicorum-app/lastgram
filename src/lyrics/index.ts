import { debug } from '../logging/logging.js'

interface LyricResult {
    instrumental: boolean
    lyrics: string
    trackName: string
    artistName: string
}

interface LyricResponse {
    id: number
    trackName: string
    artistName: string
    albumName: string
    duration: number
    instrumental: boolean
    plainLyrics: string
    syncedLyrics: string
}

export const findLyrics = async (track: string, artist: string) => {
    const d1 = await getLyricsByParams(track, artist)
    if (d1) return constructLyricResult(d1)
    const d2 = await searchLyrics(`${track} ${artist}`)
    if (d2) return constructLyricResult(d2)
    debug('lyrics.findLyrics', `could not find lyrics for ${track} by ${artist}`)
    return undefined
}

const constructLyricResult = (response: LyricResponse): LyricResult => {
    return {
        instrumental: response.instrumental,
        lyrics: response.plainLyrics,
        trackName: response.trackName,
        artistName: response.artistName
    }
}

const getLyricsByParams = async (track: string, artist: string): Promise<LyricResponse | undefined> => {
    const response = await fetch(
        `https://lrclib.net/api/get?track_name=${encodeURIComponent(track)}&artist_name=${encodeURIComponent(artist)}`,
        { method: 'GET', headers: { 'User-Agent': 'lastgram robot (https://github.com/musicorum-app/lastgram)' } }
    ).then((res: Response) => res.json()).then((r) => r?.id ? r : undefined)
    if (!response) return undefined

    debug('lyrics.getLyricsByParams', `got ${response.trackName} by ${response.artistName}`)
    return response
}

const searchLyrics = async (query: string): Promise<LyricResponse | undefined> => {
    const response = await fetch(
        `https://lrclib.net/api/search?q=${encodeURIComponent(query)}`,
        { method: 'GET', headers: { 'User-Agent': 'lastgram robot (https://github.com/musicorum-app/lastgram)' } }
    ).then((res: Response) => res.json()).then((r) => r?.[0] || undefined)
    if (!response) return undefined

    debug('lyrics.searchLyrics', `searched for ${query}, got ${response.trackName} by ${response.artistName}`)
    return response
}
