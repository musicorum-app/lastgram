import { Context } from "@/multiplatforms/common/context"
import { getNowPlaying } from "@/fm/completeNowPlaying"
import { checkIfUserHasCrown } from "@/database/operations/crowns"

export default async (ctx: Context) => {
    const data = await getNowPlaying(ctx, "track")
    const user = ctx.targetedUser ?? ctx.registeredUser
    const userData = ctx.targetedUserData ?? ctx.registeredUserData

    const hasCrown = await checkIfUserHasCrown(
        ctx.channel.id,
        userData.fmUsername,
        data.artistMbid,
    )

    ctx.reply(
        `commands:listening`,
        {
            user: user.name,
            artistCrown: hasCrown ? "👑" : "🧑‍🎤",
            isListening: data.isNowPlaying ? "isPlaying" : "wasPlaying",
            track: data.name,
            artist: data.artist,
            album: data.album,
            playCount: data.playCount,
            emoji: data.loved ? userData.likedEmoji : "🎵",
            tags:
                userData.sendTags && data.tags.length > 0
                    ? `\n*${data.tags.map((a) => `#${a}`).join(" ")}*`
                    : "",
            joinArrays: "\n",
        },
        { imageURL: data.imageURL, sendImageAsPhoto: !userData.sendPhotosAsLink },
    )
};

export const info = {
    aliases: ["lt", "ln", "lp", "pl", "pt", "listening", "listen"],
}
