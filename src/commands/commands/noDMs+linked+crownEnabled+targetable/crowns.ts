import { Context } from "@/multiplatforms/common/context"
import { getUserCrowns } from "@/database/operations/crowns"

export default async (ctx: Context) => {
    const userId =
        ctx.targetedUserData?.id ?? ctx.registeredUserData!.id
    const displayName = ctx.targetedUser?.name ?? ctx.registeredUser!.name

    const crowns = await getUserCrowns(ctx.channel.id, userId).then((r) => {
        if (!r?.length) return undefined
        return r.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    })

    const crownCount = crowns?.length || 0

    if (crownCount === 0 || !crowns) {
        return ctx.reply("commands:crowns.noCrowns", { displayName })
    }

    let crownsText = ""
    for (let i = 0; i < crownCount; i++) {
        const crown = crowns[i]
        const currentHolder = crown.crownHolders[0]
        crownsText +=
            ctx.t("commands:crowns.crown", {
                position: i + 1,
                artistName: crown.entity.name,
                playCount: currentHolder?.playCount ?? 0,
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
    description: "View a list of your crowns",
    aliases: ["crws", "coroas"],
}
