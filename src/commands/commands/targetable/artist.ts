import { Context } from "../../../multiplatforms/common/context.js"
import { getNowPlaying } from "../../../fm/completeNowPlaying.js"
import { warn } from "../../../logging/logging.js"
import { checkIfUserHasCrown } from "../../../database/operations/crowns.js"

export default async (ctx: Context) => {
    const data = await getNowPlaying(ctx, "artist")
    const user = ctx.targetedUser ?? ctx.registeredUser
    const userData = ctx.targetedUserData ?? ctx.registeredUserData

    const hasCrown = await checkIfUserHasCrown(
        ctx.channel.id,
        userData.fmUsername,
        data.artistMbid,
    )

    if (!data.mbid) warn("commands.artist", `no mbid found for ${data.artist}`)

    ctx.reply(
        `commands:artist`,
        {
            user: user.name,
            artistCrown: hasCrown ? "👑" : "🧑‍🎤",
            isListening: data.isNowPlaying ? "isPlaying" : "wasPlaying",
            artist: data.artist,
            playCount: data.playCount,
            joinArrays: "\n",
            tags:
                userData.sendTags && data.tags.length > 0
                    ? `\n*${data.tags.map((a) => `#${a}`).join(" ")}*`
                    : "",
        },
        { imageURL: data.imageURL, sendImageAsPhoto: !userData.sendPhotosAsLink },
    )
};

export const info = {
    aliases: ["art"],
}
