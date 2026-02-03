import { Context } from '../../../multiplatforms/common/context.js'
import { loveTrack, LoveTrackRequest, unloveTrack } from '../../../behavioral/index.js'
import { getNowPlaying } from '../../../fm/completeNowPlaying.js'

export default async (ctx: Context) => {
    const data = await getNowPlaying(ctx, 'track', false, true)
    if (!data.isNowPlaying) return ctx.reply('commands:lovetrack.notPlaying')
    if (!data.artist) return ctx.reply('commands:lovetrack.noArtist')

    const req: LoveTrackRequest = {
        title: data.name!,
        artist: data.artist!,
        sessionKey: ctx.guardData.registeredUserData!.sessionKey!,
        username: ctx.guardData.registeredUserData!.fmUsername
    }

    const text = data.loved ? await unloveTrack(req) : await loveTrack(req)
    return ctx.reply(text, { track: data.name, artist: data.artist })
}

export const info = {
    aliases: ['amei', '❤️', 'unlove', 'desamei', 'gostei', 'desgostar']
}
