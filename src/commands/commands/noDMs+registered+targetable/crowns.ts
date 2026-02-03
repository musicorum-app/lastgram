import { Context } from "../../../multiplatforms/common/context.js"
import { getUserCrowns } from "../../../database/operations/crowns.js"
import { getArtistDataByMbid } from "../../../database/operations"

export default async (ctx: Context) => {
    const username =
        ctx.targetedUserData?.fmUsername ?? ctx.registeredUserData!.fmUsername
    const displayName = ctx.targetedUser?.name ?? ctx.registeredUser!.name

    const crowns = await getUserCrowns(ctx.channel.id, username).then((r) => {
        if (!r?.length) return undefined
        return r.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    })

    const crownCount = crowns?.length || 0

    if (crownCount === 0 || !crowns) {
        return ctx.reply("commands:crowns.noCrowns", { displayName })
    }

    // sort by createdAt
    const artistNames = await Promise.all(
        crowns.map((c) =>
            getArtistDataByMbid(c.artistId).then((a) => a.name),
        ),
    )
    let crownsText = ""
    for (let i = 0; i < crownCount; i++) {
        const crown = crowns[i]
        crownsText +=
            ctx.t("commands:crowns.crown", {
                position: i + 1,
                artistName: artistNames[i],
                playCount: crown.playCount,
                count: crown.switchedTimes,
            }) + "\n"
    }

    if (crownsText.length > 3800) {
        crownsText = crownsText.slice(0, 3800) + "..."
    }

    return ctx.reply("commands:crowns.list", {
        displayName,
        groupName: ctx.channel.name,
        crownCount,
        crownsText,
        joinArrays: "\n",
    })
};

export const info = {
    aliases: ["crws", "coroas"],
}
