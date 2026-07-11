import { Context } from "@/multiplatforms/common/context"
import { getNowPlaying } from "@/fm/completeNowPlaying"
import { checkIfUserHasCrown } from "@/database/operations/crowns"
import { EntityType } from "@/prisma/client"
import { lt } from "@/translations"

const TAYLOR_SWIFT_ARTISTS = ["Taylor Swift"]

export default async (ctx: Context) => {
    const data = await getNowPlaying(ctx, 'regular', 'track')
    const user = ctx.targetedUser ?? ctx.registeredUser
    const userData = ctx.targetedUserData ?? ctx.registeredUserData

    const hasCrown = await checkIfUserHasCrown(
        ctx.channel.id,
        userData.id,
        EntityType.TRACK,
        data.id, // Epistolares entity ID
    )

    const isTaylorSwift = TAYLOR_SWIFT_ARTISTS.some(
        (name) => data.artist?.toLowerCase() === name.toLowerCase()
    )
    const easterEggTriggered = isTaylorSwift && Math.random() < 1 / 100

    const translationData = {
        user: user.name,
        artistCrown: hasCrown ? "👑" : "🧑‍🎤",
        isListening: data.isNowPlaying ? "isPlaying" : "wasPlaying",
        track: data.name,
        artist: data.artist,
        album: data.album,
        playCount: data.playCount,
        emoji: data.loved ? userData.likedEmoji : "🎵",
        tags:
            userData.sendTags && data.tags.length > 0
                ? `\n*${data.tags.map((a) => `#${a}`).join(" ")}*`
                : "",
        joinArrays: "\n",
    }

    if (easterEggTriggered) {
        ctx.reply(
            lt("he", "commands:listening", translationData),
            {},
            { noTranslation: true, imageURL: data.imageURL, sendImageAsPhoto: !userData.sendPhotosAsLink },
        )
    } else {
        ctx.reply(
            `commands:listening`,
            translationData,
            { imageURL: data.imageURL, sendImageAsPhoto: !userData.sendPhotosAsLink },
        )
    }
};

export const info = {
    description: "See what you are currently listening to",
    aliases: ["lt", "ln", "lp", "pl", "pt", "listening", "listen"],
}
