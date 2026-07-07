import { error, grey } from "@/logging/logging"

const EPISTOLARES_ROOT_URL = process.env.EPISTOLARES_ROOT_URL ||  'https://epistolares.stg.musicorum.cloud'

export interface AlbumInfo {
    id: string
    name: string
    artist: string
    scrobbles: number
    listeners: number
    userScrobbles?: {
        playCount: number
    }
    url: string
    tracks: {
        id: string
        name: string
        rank: number
    }[]
    tags: string[]
    cover: {
        template: string
        defaultURL: string
    }
}

export interface ArtistInfo {
    name: string
    id: string
    bio?: {
        license: string
        summary: string
        content: string
    }
    cover: {
        template: string
        defaultURL: string
    }
    listeners: number
    scrobbles: number
    similarArtists: {
        name: string
        cover: {
            template: string
            defaultURL: string
        }
        id: string
    }[]
    userScrobbles?: {
        playCount: number
    }
    tags: string[]
}

export interface TrackInfo {
        id: string
        listeners: number
        scrobbles: number
        name: string
        tags: string[]
        cover: {
            template: string
            defaultURL: string
        }
        userScrobbles?: {
            loved: boolean
            playCount: number
        }
}

export interface RecentTrack {
    track: TrackInfo
    album: AlbumInfo
    artist: ArtistInfo
    nowPlaying: boolean
}


const makeRequest = async (path: string, params: Record<string, any> = {}) => {
    const url = `${EPISTOLARES_ROOT_URL}${path}?${new URLSearchParams(params)}`
    const resp = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (!resp.ok) {
        let text = await resp.text()
        try {
            const data = JSON.parse(text)
            if (data.error) return data
        } catch { }
        error('epistolares.makeRequest', `request failed: ${resp.status} ${resp.statusText}\n${text}`)
        throw new Error('epistolares.makeRequest')
    }
    const data = await resp.json()
    return data
}

export const getRecentTracks = async (username: string, limit: number) => {
    const data = await makeRequest(`/user/recent-tracks`, {
        username,
        limit
    })
    if (data.error) {
        if (data.reason === 'Not Found' || data.reason === 'User not found') return []
        throw new Error(data.reason)
    }

    return data.items as RecentTrack[]
}


export const getArtistInfo = async (username: string, name: string) => {
    const data = await makeRequest(`/artist/info`, {
        username,
        name
    })

    if (data.error) {
        if (data.reason === 'Not Found' || data.reason === 'Artist not found') return null
        throw new Error(data.reason)
    }
    return data as ArtistInfo
}


export const getAlbumInfo = async (username: string, artist: string, name: string) => {
    const data = await makeRequest(`/album/info`, {
        username,
        artist,
        name
    })

    if (data.error) {
        if (data.reason === 'Not Found' || data.reason === 'Album not found') return null
        throw new Error(data.reason)
    }
    return data as AlbumInfo
}

export const getTrackInfo = async (username: string, artist: string, album: string, name: string) => {
    const data = await makeRequest(`/track/info`, {
        username,
        artist,
        album,
        track: name
    })

    if (data.error) {
        if (data.reason === 'Not Found' || data.reason === 'Track not found') return null
        throw new Error(data.reason)
    }
    return data as {
        track: TrackInfo
        album: AlbumInfo
        artist: ArtistInfo
    }
}