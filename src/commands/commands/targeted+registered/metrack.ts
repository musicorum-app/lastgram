import { Context } from "@/multiplatforms/common/context"
import { getNowPlaying } from "@/fm/completeNowPlaying"
import { checkIfUserHasCrown } from "@/database/operations/crowns"
import { EntityType } from "@/prisma/client"

export default async (ctx: Context) => {
    const data = await getNowPlaying(ctx, 'me', 'track')

    const hasCrown = await checkIfUserHasCrown(
        ctx.channel.id,
        ctx.registeredUserData!.id,
        EntityType.TRACK,
        data.id,
    )

    ctx.reply(
        `commands:youtrack`,
        {
            user: ctx.registeredUser?.name,
            artistCrown: hasCrown ? "👑" : "🧑‍🎤",
            track: data.name,
            artist: data.artist,
            album: data.album,
            playCount: data.playCount,
            tags:
                ctx.registeredUserData.sendTags && data.tags.length > 0
                    ? `\n*${data.tags.map((a) => `#${a}`).join(" ")}*`
                    : "",
            emoji: data.loved ? ctx.registeredUserData.likedEmoji : "🎵",
            joinArrays: "\n",
        },
        {
            imageURL: data.imageURL,
            sendImageAsPhoto: !ctx.registeredUserData?.sendPhotosAsLink,
        },
    )
};

export const info = {
    aliases: ["me", "eu"],
}
