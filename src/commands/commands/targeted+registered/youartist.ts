import { Context } from "@/multiplatforms/common/context"
import { getNowPlaying } from "@/fm/completeNowPlaying"

export default async (ctx: Context) => {
    const data = await getNowPlaying(ctx, "artist", true)

    ctx.reply(
        `commands:youartist`,
        {
            user: ctx.targetedUser?.name,
            artist: data.artist,
            playCount: data.playCount,
            joinArrays: "\n",
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
    aliases: ["youart", "vcart"],
}
