import { Context } from "@/multiplatforms/common/context"
import { getNowPlaying } from "@/fm/completeNowPlaying"

export default async (ctx: Context) => {
    const data = await getNowPlaying(ctx, "album", false, true)

    ctx.reply(
        `commands:mealbum`,
        {
            user: ctx.registeredUser?.name,
            artist: data.artist,
            album: data.album,
            playCount: data.playCount,
            tags:
                ctx.registeredUserData.sendTags && data.tags.length > 0
                    ? `\n*${data.tags.map((a) => `#${a}`).join(" ")}*`
                    : "",
            joinArrays: "\n",
        },
        {
            imageURL: data.imageURL,
            sendImageAsPhoto: !ctx.registeredUserData?.sendPhotosAsLink,
        },
    )
};

export const info = {
    aliases: ["mealb", "eualb"],
}
