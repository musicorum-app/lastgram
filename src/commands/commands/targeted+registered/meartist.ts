import { Context } from "@/multiplatforms/common/context"
import { getNowPlaying } from "@/fm/completeNowPlaying"
import { checkIfUserHasCrown } from "@/database/operations/crowns"
import { EntityType } from "@/prisma/client"

export default async (ctx: Context) => {
    const data = await getNowPlaying(ctx, 'me', 'artist')

    const hasCrown = await checkIfUserHasCrown(
        ctx.channel.id,
        ctx.registeredUserData!.id,
        EntityType.ARTIST,
        data.id,
    )

    ctx.reply(
        `commands:meartist`,
        {
            user: ctx.registeredUser?.name,
            artistCrown: hasCrown ? "👑" : "🧑‍🎤",
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
