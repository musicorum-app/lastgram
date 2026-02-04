import { client } from "@/fm/index"

export interface LoveTrackRequest {
    sessionKey: string,
    title: string,
    artist: string,
    username: string
}

export const loveTrack = async (req: LoveTrackRequest) => {
    return client.track.love(req.title, req.artist, req.sessionKey).then(() => {
        return 'commands:lovetrack.success'
    })
}
export const unloveTrack = async (req: LoveTrackRequest) => {
    return client.track.love(req.title, req.artist, req.sessionKey).then(() => {
        return 'commands:lovetrack.notAnymore'
    })
}
