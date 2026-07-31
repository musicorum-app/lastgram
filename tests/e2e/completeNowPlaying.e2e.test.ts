import { describe, expect, it, mock } from 'bun:test'

mock.module('@/database/operations', () => ({
    upsertEntityScrobble: async () => undefined,
    linkEntity: async () => undefined,
    getEntityDataByExternalId: async () => null,
    upsertEntityCoverUrl: async () => undefined,
    addUserToGroupList: async () => undefined,
}))

const SELF_USER = 'blueslimee'
const OTHER_USER = 'olhosdefractal'
const KNOWN_ARTIST = 'Sulli'
const KNOWN_TRACK = 'Dorothy'
const KNOWN_ALBUM = 'Goblin'

// @ts-ignore
const { getTrackInfo, getRecentTracks, getAlbumInfo, getArtistInfo } = await import('@/fm/epistolares')

describe('epistolares /track/info handling', () => {
    it('returns the real playcount when the album matches exactly', async () => {
        const data = await getTrackInfo(SELF_USER, KNOWN_ARTIST, KNOWN_ALBUM, KNOWN_TRACK)
        expect(data?.track.userScrobbles?.playCount).toBeGreaterThan(0)
    })

    it('returns the real playcount when no album is known', async () => {
        const data = await getTrackInfo(SELF_USER, KNOWN_ARTIST, undefined as unknown as string, KNOWN_TRACK)
        expect(data?.track.userScrobbles?.playCount).toBeGreaterThan(0)
    })

    it('still returns the real playcount when album is an empty string', async () => {
        const baseline = await getTrackInfo(SELF_USER, KNOWN_ARTIST, KNOWN_ALBUM, KNOWN_TRACK)
        expect(baseline?.track.userScrobbles?.playCount).toBeGreaterThan(0)

        const withEmptyAlbum = await getTrackInfo(SELF_USER, KNOWN_ARTIST, '', KNOWN_TRACK)
        expect(withEmptyAlbum?.track.userScrobbles?.playCount).toBe(baseline?.track.userScrobbles?.playCount)
    })
})

describe('getNowPlaying("me", "track")', () => {
    it('reports the real scrobble count for a track the calling user has genuinely scrobbled', async () => {
        const otherUserNowPlaying = await getRecentTracks(OTHER_USER, 1).then((r: any) => r?.[0])
        expect(otherUserNowPlaying).toBeTruthy()

        mock.module('@/fm/epistolares', () => ({
            getRecentTracks: async (username: string, limit: number) => {
                if (username === OTHER_USER) {
                    return [{
                        ...otherUserNowPlaying,
                        artist: { ...otherUserNowPlaying!.artist, name: KNOWN_ARTIST },
                        album: { ...otherUserNowPlaying!.album, name: KNOWN_ALBUM },
                        track: { ...otherUserNowPlaying!.track, name: KNOWN_TRACK },
                    }]
                }
                return getRecentTracks(username, limit)
            },
            getTrackInfo,
            getAlbumInfo,
            getArtistInfo,
        }))

        // @ts-ignore
        const { getNowPlaying } = await import('@/fm/completeNowPlaying')

        const fakeCtx = {
            registeredUserData: { lastFmUsername: SELF_USER },
            targetedUserData: { lastFmUsername: OTHER_USER },
        } as any

        const result = await getNowPlaying(fakeCtx, 'me', 'track')

        const groundTruth = await getTrackInfo(SELF_USER, KNOWN_ARTIST, KNOWN_ALBUM, KNOWN_TRACK)
        expect(groundTruth?.track.userScrobbles?.playCount).toBeGreaterThan(0)

        expect(result.playCount).toBe(groundTruth!.track.userScrobbles!.playCount)
    })
})
