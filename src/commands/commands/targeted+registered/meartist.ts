import { Context } from "@/multiplatforms/common/context"
import { getNowPlaying } from "@/fm/completeNowPlaying"

export default async (ctx: Context) => {
    const data = await getNowPlaying(ctx, "artist", false, true)

    ctx.reply(
        `commands:meartist`,
        {
            user: ctx.registeredUser?.name,
            artist: data.artist,
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
    aliases: ["meart", "euart"],
}
