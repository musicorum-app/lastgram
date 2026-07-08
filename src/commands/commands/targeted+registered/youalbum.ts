import { Context } from "@/multiplatforms/common/context"
import { getNowPlaying } from "@/fm/completeNowPlaying"
import { checkIfUserHasCrown } from "@/database/operations/crowns"
import { EntityType } from "@/prisma/client"

export default async (ctx: Context) => {
    const data = await getNowPlaying(ctx, 'you', 'album')

    const hasCrown = await checkIfUserHasCrown(
        ctx.channel.id,
        ctx.targetedUserData!.id,
        EntityType.ALBUM,
        data.id,
    )

    ctx.reply(
        `commands:youalbum`,
        {
            user: ctx.targetedUser?.name,
            artistCrown: hasCrown ? "👑" : "🧑‍🎤",
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
    description: "Compare your album scrobbles with a user",
    aliases: ["youalb", "vcalb"],
}
