import { Context } from "@/multiplatforms/common/context"
import { getNowPlaying } from "@/fm/completeNowPlaying"
import { checkIfUserHasCrown } from "@/database/operations/crowns"
import { EntityType } from "@/prisma/client"

export default async (ctx: Context) => {
    const data = await getNowPlaying(ctx, 'you', 'artist')

    const hasCrown = await checkIfUserHasCrown(
        ctx.channel.id,
        ctx.targetedUserData!.id,
        EntityType.ARTIST,
        data.id,
    )

    ctx.reply(
        `commands:youartist`,
        {
            user: ctx.targetedUser?.name,
            artistCrown: hasCrown ? "👑" : "🧑‍🎤",
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
