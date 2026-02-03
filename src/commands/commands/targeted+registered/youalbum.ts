import { Context } from "../../../multiplatforms/common/context.js"
import { getNowPlaying } from "../../../fm/completeNowPlaying.js"

export default async (ctx: Context) => {
    const data = await getNowPlaying(ctx, "album", true)

    ctx.reply(
        `commands:youalbum`,
        {
            user: ctx.targetedUser?.name,
            artist: data.artist,
            album: data.album,
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
    aliases: ["youalb", "vcalb"],
}
