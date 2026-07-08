import { Context } from "@/multiplatforms/common/context"
import { getNowPlaying } from "@/fm/completeNowPlaying"
import { checkIfUserHasCrown } from "@/database/operations/crowns"
import { EntityType } from "@/prisma/client"

export default async (ctx: Context) => {
    const data = await getNowPlaying(ctx, 'you', 'track')

    const hasCrown = await checkIfUserHasCrown(
        ctx.channel.id,
        ctx.targetedUserData!.id,
        EntityType.TRACK,
        data.id,
    )

    ctx.reply(
        `commands:youtrack`,
        {
            user: ctx.targetedUser?.name,
            artistCrown: hasCrown ? "👑" : "🧑‍🎤",
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
    description: "Compare your track scrobbles with a user",
    aliases: ["you", "vc"],
}
