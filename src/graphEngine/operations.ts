import { Client, types } from 'cassandra-driver'
import { debug, error } from '../loggingEngine/logging.js'
import { getUserDisplayName } from '../databaseEngine/index.js'
import { hashName } from '../utils.js'
import ResultSet = types.ResultSet
import Row = types.Row

// returns now date because cassandra-driver is retarded    
export const now = () => new Date()

export const upsertArtistScrobble = async (client: Client, fmUsername: string, artistMbid: string, playCount: number) => {
  const query = `
      INSERT INTO artist_scrobbles (playCount, createdAt, updatedAt, fmUsername, artistMbid)
      VALUES (?, ?, ?, ?, ?)
          IF NOT EXISTS;
  `
  const n = now()
  const r = await client.execute(query, [playCount, n, n, fmUsername.toLowerCase(), artistMbid], { prepare: true }).catch((e) => {
    error('graphEngine.upsertArtistScrobble', e.stack)
    throw e
  })

  if (r.first()) {
    return r.rows[0]
  } else {
    return await client.execute(`
        UPDATE artist_scrobbles
        SET playCount = ? AND updatedAt = ?
        WHERE fmUsername = ?
          AND artistMbid = ?;
    `, [playCount, now(), fmUsername.toLowerCase(), artistMbid], { prepare: true })
  }
}

export const getArtistScrobble = async (client: Client, fmUsername: string, artistMbid: string) => {
  const query = `
      SELECT *
      FROM artist_scrobbles
      WHERE fmUsername = ?
        AND artistMbid = ?;
  `
  debug('graphEngine.getArtistScrobble', `getting artist scrobble for ${fmUsername} on ${artistMbid}`)
  const r = await client.execute(query, [fmUsername.toLowerCase(), artistMbid], { prepare: true })
  return r.first()
}

// returns the crown for the given group id, with the artist scrobble data
export const getCrown = async (client: Client, groupId: string, artistMbid: string) => {
  const query = `
      SELECT *
      FROM crowns
      WHERE groupId = ?
        AND artistmbid = ?;
  `
  const r = await client.execute(query, [groupId, artistMbid], { prepare: true })
  return r.first()
}

export const getUserCrowns = async (client: Client, groupId: string, fmUsername: string) => {
  const query = `
      SELECT *
      FROM crowns
      WHERE groupId = ?
        AND fmusername = ?
          ALLOW FILTERING;
  `
  const r = await client.execute(query, [groupId, fmUsername], { prepare: true })
  return r.rows
}

export const upsertCrown = async (client: Client, groupId: string, artistMbid: string, fmUsername: string, playCount: number, jumpToUpdate: boolean = false) => {
  const query = `
      INSERT INTO crowns (groupId, artistmbid, fmUsername, playCount, createdAt, updatedAt, switchedtimes)
      VALUES (?, ?, ?, ?, ?, ?, 0)
          IF NOT EXISTS;
  `
  const n = now()
  const r = !jumpToUpdate && await client.execute(query, [groupId, artistMbid, fmUsername, playCount, n, n], { prepare: true })
  if (r) return (r as ResultSet)?.rows?.[0]

  debug('graphEngine.upsertCrown', `updating crown for ${groupId} on ${artistMbid} with ${fmUsername} and ${playCount}`)
  await client.execute(`
      UPDATE crowns
      SET playCount = ?,
          updatedAt = ?
      WHERE groupId = ?
        AND artistMbid = ?;
  `, [playCount, now(), groupId, artistMbid], { prepare: true })
}

export const appendToPastCrownHolders = async (client: Client, groupId: string, artistMbid: string, fmUsername: string, playCount: number) => {
  const n = now()
  return await client.execute(`
      INSERT INTO crown_holders (groupId, artistMbid, fmUsername, playCount, createdAt)
      VALUES (?, ?, ?, ?, ?);
  `, [groupId, artistMbid, fmUsername, playCount, n], { prepare: true })
}

interface CrownResult {
  success: boolean
  reason?: string,
  crown?: Row
}

export const tryGetToCrown = async (client: Client, groupId: string, artistMbid: string, fmUsername: string, artistName: string, playCount: number): Promise<CrownResult> => {
  // first, we must get the fmUser's artist scrobble
  let artistScrobble = await getArtistScrobble(client, fmUsername, artistMbid).catch((e) => {
    error('graphEngine.tryGetToCrown', 'failed to get artist scrobble: ' + e.stack)
    throw e
  })

  // now, we compare the artist scrobble's playCount to the crown's playCount
  const crown = await getCrown(client, groupId, artistMbid).catch((e) => {
    error('graphEngine.tryGetToCrown', 'failed to get crown: ' + e.stack)
    throw e
  })

  if (artistScrobble?.playcount < 3 && playCount < 3) {
    return { success: false, reason: 'noScrobbles', crown }
  } else {
    await upsertArtistScrobble(client, fmUsername, artistMbid, playCount)
    artistScrobble = {
      fmusername: fmUsername,
      artistmbid: artistMbid,
      playcount: playCount
    } as any
  }

  // if the username is the same as the crown's, we just update the play count
  if (crown && crown.fmusername.toLowerCase() === fmUsername.toLowerCase()) {
    if (!crown.playcount || playCount > crown.playcount) await upsertCrown(client, groupId, artistMbid, fmUsername, artistScrobble.playcount, true)
    return { success: false, reason: 'alreadyHas', crown }
  }

  if (!crown) {
    // if it doesn't exist, the user can get the crown
    await upsertCrown(client, groupId, artistMbid, fmUsername, artistScrobble.playcount)
    return { success: true }
  }

  if (artistScrobble.playcount > crown.playcount) {
    // now, just to be sure, we get the artistscrobbleid from the crown and check if it's still less than fmUser's playCount
    const artistScrobbleFromCrown = await getArtistScrobble(client, crown.fmusername, artistMbid).catch((e) => {
      error('graphEngine.tryGetToCrown', 'failed to get artist scrobble from crown: ' + e.stack)
      throw e
    })

    if (artistScrobble.playcount > artistScrobbleFromCrown.playcount) {
      // if it is, we give the crown to the other user
      await client.execute(`
          UPDATE crowns
          SET fmUsername    = ?,
              playCount     = ?,
              updatedAt     = ?,
              switchedtimes = ?
          WHERE groupId = ?
            AND artistMbid = ?;
      `, [fmUsername, playCount, now(), (crown.switchedtimes || 0) + 1, groupId, artistMbid
      ], { prepare: true }).catch((e) => {
        error('graphEngine.tryGetToCrown', 'failed to update crown: ' + e.stack)
        throw e
      })

      await appendToPastCrownHolders(client, groupId, artistMbid, crown.fmusername, crown.playcount).catch((e) => {
        error('graphEngine.tryGetToCrown', 'failed to append to past crown holders: ' + e.stack)
        throw e
      })

      const crownNow = await getCrown(client, groupId, artistMbid).catch((e) => {
        error('graphEngine.tryGetToCrown', 'failed to get crown: ' + e.stack)
        throw e
      })

      return { success: true, crown: crownNow }
    } else {
      // if it's not, we update the play count
      await upsertCrown(client, groupId, artistMbid, fmUsername, artistScrobble.playcount, true)
      return { success: false, reason: 'notEnough', crown }
    }
  } else {
    return { success: false, reason: 'notEnough', crown }
  }
}

interface PastCrownHolder {
  name: string,
  playCount: number
}

export const getCountPastCrownHolders = async (client: Client, groupId: string, artistMbid: string) => {
  const query = `
      SELECT fmUsername, playCount
      FROM crown_holders
      WHERE groupId = ?
        AND artistMbid = ?;
  `
  const r = await client.execute(query, [groupId, artistMbid], { prepare: true })
  if (!r.rows?.[0]) return []
  let holders: PastCrownHolder[] = []
  await Promise.all(r.rows.map(async (row: Row) => {
    const name = await getUserDisplayName(row.fmusername) || { displayName: row.fmUsername }
    holders.push({ name: name.displayName, playCount: row.playcount })
  }))

  return holders
}

export const addUserToGroupList = async (client: Client, groupId: string, fmUsername: string) => {
  const n = now()
  return await client.execute(`
      INSERT INTO group_members (groupId, fmUsername, createdAt, updatedAt)
      VALUES (?, ?, ?, ?)
          IF NOT EXISTS;
  `, [groupId, fmUsername, n, n], { prepare: true }).catch((e) => {
    error('graphEngine.addUserToGroupList', e.stack)
    throw e
  })
}

export const linkArtistNameToMbid = async (client: Client, artistName: string, artistMbid: string | undefined) => {
  return await client.execute(`
      INSERT INTO artist_mbid_map (artistName, artistMbid)
      VALUES (?, ?)
          IF NOT EXISTS;
  `, [artistName, artistMbid || hashName(artistName)], { prepare: true }).catch((e) => {
    error('graphEngine.linkArtistNameToMbid', e.stack)
    throw e
  })
}

export const getArtistNameFromMbid = async (client: Client, artistMbid: string) => {
  const query = `
      SELECT artistName
      FROM artist_mbid_map
      WHERE artistMbid = ?;
  `
  const r = await client.execute(query, [artistMbid], { prepare: true }).catch((e) => {
    error('graphEngine.getArtistNameFromMbid', e.stack + ' ' + artistMbid)
    throw e
  })
  console.log(r.rows, artistMbid)
  return r.rows[0]?.artistname
}