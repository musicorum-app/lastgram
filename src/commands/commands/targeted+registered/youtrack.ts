import { Context } from "@/multiplatforms/common/context"
import { getNowPlaying } from "@/fm/completeNowPlaying"

export default async (ctx: Context) => {
    const data = await getNowPlaying(ctx, "track", true)

    ctx.reply(
        `commands:youtrack`,
        {
            user: ctx.targetedUser?.name,
            track: data.name,
            artist: data.artist,
            album: data.album,
            playCount: data.playCount,
            emoji: data.loved ? ctx.targetedUserData.likedEmoji : "🎵",
            tags:
                ctx.targetedUserData.sendTags && data.tags.length > 0
                    ? `\n*${data.tags.map((a) => `#${a}`).join(" ")}*`
                    : "",
        },
        {
            imageURL: data.imageURL,
            sendImageAsPhoto: !ctx.targetedUserData?.sendPhotosAsLink,
        },
    )
};

export const info = {
    aliases: ["you", "vc"],
}
