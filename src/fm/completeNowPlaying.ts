import { NoScrobblesError } from "@/commands/errors"
import { Context } from "@/multiplatforms/common/context"
import { debug, error } from "@/logging/logging"
import { getRecentTracks, RecentTrack, getAlbumInfo, getArtistInfo, getTrackInfo } from "./epistolares"
import { EntityType } from "@/prisma/client"
import { upsertEntityScrobble } from "@/database/operations"

export type NowPlayingEntity = "artist" | "album" | "track";

export interface NowPlayingData {
    name?: string;
    id: string;
    imageURL: string;
    artist?: string;
    album?: string;
    playCount?: number;
    loved: boolean;
    tags: string[];
    isNowPlaying: boolean;
}

const getMatchingEntityRequestForUser = (
    entity: NowPlayingEntity,
    user: string,
    name: string,
    artist: string | undefined,
    album: string | undefined
) => {
    switch (entity) {
        case 'artist':
            return getArtistInfo(user, artist!)
        case 'album':
            return getAlbumInfo(user, artist!, album!)
        case 'track':
            return getTrackInfo(user, artist!, album!, name).then(a => a?.track)
    }
}

const findScrobblesForEntity = (recent: RecentTrack, entity: NowPlayingEntity) => {
    switch (entity) {
        case 'artist':
            return recent.artist.userScrobbles?.playCount || 0
        case 'album':
            return recent.album.userScrobbles?.playCount || 0
        case 'track':
            return recent.track.userScrobbles?.playCount || 0
    }
}

const findCoverForEntity = (recent: RecentTrack, entity: NowPlayingEntity) => {
    switch (entity) {
        case 'track':
            return recent.track?.cover?.defaultURL || recent.album?.cover?.defaultURL || recent.artist?.cover?.defaultURL
        case 'album':
            return recent.album?.cover?.defaultURL || recent.artist?.cover?.defaultURL
        case 'artist':
            return recent.artist?.cover?.defaultURL
    }
}

const findIdForEntity = (recent: RecentTrack, entity: NowPlayingEntity) => {
    switch (entity) {
        case 'artist':
            return recent.artist.id
        case 'album':
            return recent.album.id
        case 'track':
            return recent.track.id
    }
}

export const getNowPlaying = async (
    ctx: Context,
    usingCommandStyle: 'me' | 'you' | 'regular',
    entity: NowPlayingEntity
): Promise<NowPlayingData> => {
    let nowPlaying: NowPlayingData | null = null
    let recentTrack: RecentTrack | null = null
    let fmUsername: string

    if (usingCommandStyle === 'regular') {
        const me = await getRecentTracks(ctx.registeredUserData.lastFmUsername, 1).then(r => r?.[0])
        if (!me) throw new NoScrobblesError(ctx)
        recentTrack = me
        fmUsername = ctx.registeredUserData.lastFmUsername
        nowPlaying = {
            name: me.track.name,
            id: findIdForEntity(me, entity),
            artist: me.artist.name,
            album: me.album?.name || '',
            playCount: findScrobblesForEntity(me, entity),
            loved: me.track.userScrobbles?.loved || false,
            tags: me.track.tags,
            isNowPlaying: me.nowPlaying,
            imageURL: findCoverForEntity(me, entity)
        }
    } else if (usingCommandStyle === 'you') { // what I am listening to, then how much scrobbles the targeted user has
        const me = await getRecentTracks(ctx.registeredUserData.lastFmUsername, 1).then(r => r?.[0])
        if (!me) throw new NoScrobblesError(ctx)
        recentTrack = me
        fmUsername = ctx.registeredUserData.lastFmUsername
        const you = await getMatchingEntityRequestForUser(entity, ctx.targetedUserData!.lastFmUsername, me.track.name, me.artist.name, me.album?.name || '')
        nowPlaying = {
            name: me.track.name,
            id: findIdForEntity(me, entity),
            artist: me.artist.name,
            album: me.album?.name || '',
            playCount: you?.userScrobbles?.playCount || 0,
            // @ts-ignore
            loved: you?.userScrobbles?.loved || false,
            tags: me.track.tags,
            isNowPlaying: me.nowPlaying,
            imageURL: findCoverForEntity(me, entity)
        }
    } else { // what I am listening to, then how much scrobbles the targeted user has
        const me = await getRecentTracks(ctx.targetedUserData!.lastFmUsername, 1).then(r => r?.[0])
        if (!me) throw new NoScrobblesError(ctx)
        recentTrack = me
        fmUsername = ctx.registeredUserData!.lastFmUsername
        const you = await getMatchingEntityRequestForUser(entity, ctx.registeredUserData!.lastFmUsername, me.track.name, me.artist.name, me.album?.name || '')
        nowPlaying = {
            name: me.track.name,
            id: findIdForEntity(me, entity),
            artist: me.artist.name,
            album: me.album?.name || '',
            playCount: you?.userScrobbles?.playCount || 0,
            // @ts-ignore
            loved: you?.userScrobbles?.loved || false,
            tags: me.track.tags,
            isNowPlaying: me.nowPlaying,
            imageURL: findCoverForEntity(me, entity)
        }
    }
    if (!nowPlaying) throw new NoScrobblesError(ctx)

    nowPlaying.tags = nowPlaying.tags.map((a: string) =>
        a.toLowerCase().replaceAll("-", "_").replaceAll(" ", "_"),
    )

    try {
        const rt = recentTrack!
        const entitiesToCache: Array<[EntityType, string, string, number | undefined, string]> = [
            [EntityType.ARTIST, rt.artist.id, rt.artist.name, rt.artist.userScrobbles?.playCount, rt.artist.cover?.defaultURL || ''],
            [EntityType.ALBUM, rt.album.id, rt.album.name, rt.album.userScrobbles?.playCount, rt.album.cover?.defaultURL || ''],
            [EntityType.TRACK, rt.track.id, rt.track.name, rt.track.userScrobbles?.playCount, rt.track.cover?.defaultURL || ''],
        ]

        Promise.all(
            entitiesToCache
                .filter(([, id, , playCount]) => id && playCount !== undefined)
                .map(([type, externalId, name, playCount, coverUrl]) =>
                    upsertEntityScrobble(fmUsername!, type, externalId, playCount!, name, coverUrl)
                )
        ).catch(e => error('fm.completeNowPlaying.cache', e.stack))
    } catch (e: any) {
        error('fm.completeNowPlaying.cacheOuter', e.stack)
    }

    return nowPlaying
}
