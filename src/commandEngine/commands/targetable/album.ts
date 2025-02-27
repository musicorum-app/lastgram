import { Context } from "../../../multiplatformEngine/common/context.js";
import { getNowPlaying } from "../../../fmEngine/completeNowPlaying.js";
import { checkIfUserHasCrown } from "../../../graphEngine/operations/crowns.js";

export default async (ctx: Context) => {
  const data = await getNowPlaying(ctx, "album");
  const user = ctx.targetedUser ?? ctx.registeredUser;
  const userData = ctx.targetedUserData ?? ctx.registeredUserData;

  const hasCrown = await checkIfUserHasCrown(
    ctx.channel.id,
    userData.fmUsername,
    data.artistMbid,
  );

  ctx.reply(
    `commands:album`,
    {
      user: user.name,
      artistCrown: hasCrown ? "👑" : "🧑‍🎤",
      isListening: data.isNowPlaying ? "isPlaying" : "wasPlaying",
      artist: data.artist,
      album: data.album,
      playCount: data.playCount,
      joinArrays: "\n",
      tags:
        userData.sendTags && data.tags.length > 0
          ? `\n*${data.tags.map((a) => `#${a}`).join(" ")}*`
          : "",
    },
    { imageURL: data.imageURL, sendImageAsPhoto: !userData.sendPhotosAsLink },
  );
};

export const info = {
  aliases: ["alb"],
};
