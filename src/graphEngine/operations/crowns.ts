// returns the crown for the given group id, with the artist scrobble data
import { types } from "cassandra-driver";
import {
  getArtistScrobble,
  upsertArtistScrobbles,
} from "./artist-scrobbles.js";
import { debug, error } from "../../loggingEngine/logging.js";
import { getUserDisplayName } from "../../databaseEngine/index.js";
import { now } from "../operations.js";
import { client } from "../index.js";

type Row = types.Row;

interface PastCrownHolder {
  name: string;
  playCount: number;
}

interface CrownResult {
  success: boolean;
  reason?: string;
  crown?: Row;
}

interface UserWithMostCrowns {
  name: string;
  playCount: number;
}

export const getCrown = async (groupId: string, artistMbid: string) => {
  const query = `
      SELECT *
      FROM crowns
      WHERE groupId = ?
        AND artistmbid = ?;
  `;
  const r = await client.execute(query, [groupId, artistMbid], {
    prepare: true,
  });
  return r.first();
};

export const checkIfUserHasCrown = async (
  groupId: string,
  fmUsername: string,
  artistMbid: string,
) => {
  const query = `
      SELECT *
      FROM crowns
      WHERE groupId = ?
        AND fmusername = ?
        AND artistmbid = ? ALLOW FILTERING;
  `;
  const r = await client.execute(
    query,
    [groupId, fmUsername.toLowerCase(), artistMbid],
    { prepare: true },
  );
  return !!r.rows[0];
};
export const getUserCrowns = async (groupId: string, fmUsername: string) => {
  const query = `
      SELECT *
      FROM crowns
      WHERE groupId = ?
        AND fmusername = ? ALLOW FILTERING;
  `;
  const r = await client.execute(query, [groupId, fmUsername.toLowerCase()], {
    prepare: true,
  });
  return r.rows;
};

export const createCrown = async (
  groupId: string,
  artistMbid: string,
  fmUsername: string,
  playCount: number,
) => {
  const query = `
      INSERT INTO crowns (groupId, artistmbid, fmUsername, playCount, createdAt, updatedAt, switchedtimes)
      VALUES (?, ?, ?, ?, ?, ?, 0);
  `;
  const n = now();

  const r = await client.execute(
    query,
    [groupId, artistMbid, fmUsername.toLowerCase(), playCount, n, n],
    { prepare: true },
  );
  return r?.first();
};

export const updateCrownPlays = async (
  groupId: string,
  artistMbid: string,
  fmUsername: string,
  playCount: number,
) => {
  debug(
    "graphEngine.upsertCrown",
    `updating crown for ${groupId} on ${artistMbid} with ${fmUsername} and ${playCount}`,
  );
  await client.execute(
    `
      UPDATE crowns
      SET playCount = ?,
          updatedAt = ?
      WHERE groupId = ?
        AND artistMbid = ?;
  `,
    [playCount, now(), groupId, artistMbid],
    { prepare: true },
  );
};

export const transferCrownOwnership = async (
  crown: any,
  fmUsername: string,
  playCount: number,
) => {
  await client
    .execute(
      `
          UPDATE crowns
          SET fmUsername    = ?,
              playCount     = ?,
              updatedAt     = ?,
              switchedtimes = ?
          WHERE groupId = ?
            AND artistMbid = ?;
      `,
      [
        fmUsername.toLowerCase(),
        playCount,
        now(),
        (crown.switchedtimes || 0) + 1,
        crown.groupid,
        crown.artistmbid,
      ],
      { prepare: true },
    )
    .catch((e) => {
      error("graphEngine.tryGetToCrown", "failed to update crown: " + e.stack);
      throw e;
    });
};

export const appendToPastCrownHolders = async (
  groupId: string,
  artistMbid: string,
  fmUsername: string,
  playCount: number,
) => {
  return await client.execute(
    `
      INSERT INTO crown_holders (groupId, artistMbid, fmUsername, playCount, createdAt)
      VALUES (?, ?, ?, ?, ?);
  `,
    [groupId, artistMbid, fmUsername.toLowerCase(), playCount, now()],
    { prepare: true },
  );
};

export const tryToStealCrown = async (
  groupId: string,
  artistMbid: string,
  fmUsername: string,
  artistName: string,
  playCount: number,
): Promise<CrownResult> => {
  // first, we must get the fmUser's artist scrobble
  let artistScrobble = await getArtistScrobble(fmUsername, artistMbid).catch(
    (e) => {
      error(
        "graphEngine.tryGetToCrown",
        "failed to get artist scrobble: " + e.stack,
      );
      throw e;
    },
  );

  // now, we compare the artist scrobble's playCount to the crown's playCount
  const crown = await getCrown(groupId, artistMbid).catch((e) => {
    error("graphEngine.tryGetToCrown", "failed to get crown: " + e.stack);
    throw e;
  });

  if (artistScrobble?.playcount < 3 && playCount < 3) {
    return { success: false, reason: "noScrobbles", crown };
  } else {
    await upsertArtistScrobbles(fmUsername, artistMbid, playCount);
    artistScrobble = {
      fmusername: fmUsername,
      artistmbid: artistMbid,
      playcount: playCount,
    } as any;
  }

  // if the username is the same as the crown's, we just update the play count
  if (crown && crown.fmusername.toLowerCase() === fmUsername.toLowerCase()) {
    if (!crown.playcount || playCount > crown.playcount)
      await updateCrownPlays(
        groupId,
        artistMbid,
        fmUsername,
        artistScrobble.playcount,
      );
    return { success: false, reason: "alreadyHas", crown };
  }

  if (!crown) {
    // if it doesn't exist, the user can get the crown
    await createCrown(
      groupId,
      artistMbid,
      fmUsername,
      artistScrobble.playcount,
    );
    return { success: true };
  }

  if (artistScrobble.playcount > crown.playcount) {
    // now, just to be sure, we get the artistscrobbleid from the crown and check if it's still less than fmUser's playCount
    const artistScrobbleFromCrown = await getArtistScrobble(
      crown.fmusername,
      artistMbid,
    ).catch((e) => {
      error(
        "graphEngine.tryGetToCrown",
        "failed to get artist scrobble from crown: " + e.stack,
      );
      throw e;
    });

    if (artistScrobble.playcount > artistScrobbleFromCrown.playcount) {
      // if it is, we give the crown to the other user
      await transferCrownOwnership(crown, fmUsername, artistScrobble.playcount);

      await appendToPastCrownHolders(
        groupId,
        artistMbid,
        crown.fmusername,
        crown.playcount,
      ).catch((e) => {
        error(
          "graphEngine.tryGetToCrown",
          "failed to append to past crown holders: " + e.stack,
        );
        throw e;
      });

      const crownNow = await getCrown(groupId, artistMbid).catch((e) => {
        error("graphEngine.tryGetToCrown", "failed to get crown: " + e.stack);
        throw e;
      });

      return { success: true, crown: crownNow };
    } else {
      // if it's not, we update the play count
      await updateCrownPlays(
        groupId,
        artistMbid,
        fmUsername,
        artistScrobble.playcount,
      );
      return { success: false, reason: "notEnough", crown };
    }
  } else {
    return { success: false, reason: "notEnough", crown };
  }
};

export const getCountPastCrownHolders = async (
  groupId: string,
  artistMbid: string,
) => {
  const query = `
      SELECT fmUsername, playCount
      FROM crown_holders
      WHERE groupId = ?
        AND artistMbid = ?;
  `;
  const r = await client.execute(query, [groupId, artistMbid], {
    prepare: true,
  });
  if (!r.rows?.[0]) return [];
  let holders: PastCrownHolder[] = [];
  await Promise.all(
    r.rows.map(async (row: Row) => {
      const name = (await getUserDisplayName(row.fmusername)) || {
        displayName: row.fmusername,
      };
      holders.push({ name: name.displayName, playCount: row.playcount });
    }),
  );

  return holders;
};

export const getUsersWithMostCrowns = async (groupId: string) => {
  const query = `
      SELECT fmUsername, playCount
      FROM crown_holders
      WHERE groupId = ?
      GROUP BY fmUsername
      ORDER BY playCount DESC
      LIMIT 10 ALLOW FILTERING;
  `;
  const r = await client.execute(query, [groupId], { prepare: true });
  if (!r.rows?.[0]) return [];
  let users: UserWithMostCrowns[] = [];
  await Promise.all(
    r.rows.map(async (row: Row) => {
      const name = (await getUserDisplayName(row.fmusername)) || {
        displayName: row.fmusername,
      };
      users.push({ name: name.displayName, playCount: row.playcount });
    }),
  );

  return users;
};
