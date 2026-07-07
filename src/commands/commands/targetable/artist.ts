import { Context } from "@/multiplatforms/common/context"
import { getNowPlaying } from "@/fm/completeNowPlaying"
import { checkIfUserHasCrown } from "@/database/operations/crowns"
import { EntityType } from "@/prisma/client"

export default async (ctx: Context) => {
    const data = await getNowPlaying(ctx, 'regular', 'artist')
    const user = ctx.targetedUser ?? ctx.registeredUser
    const userData = ctx.targetedUserData ?? ctx.registeredUserData

    const hasCrown = await checkIfUserHasCrown(
        ctx.channel.id,
        userData.id,
        EntityType.ARTIST,
        data.id, // Epistolares entity ID
    )

    ctx.reply(
        `commands:artist`,
        {
            user: user.name,
            artistCrown: hasCrown ? "👑" : "🧑‍🎤",
            isListening: data.isNowPlaying ? "isPlaying" : "wasPlaying",
            artist: data.artist,
            playCount: data.playCount,
            joinArrays: "\n",
            tags:
                userData.sendTags && data.tags.length > 0
                    ? `\n*${data.tags.map((a) => `#${a}`).join(" ")}*`
                    : "",
        },
        { imageURL: data.imageURL, sendImageAsPhoto: !userData.sendPhotosAsLink },
    )
};

export const info = {
    aliases: ["art"],
}
