import { Client, types } from 'cassandra-driver'
import { debug, error } from '../loggingEngine/logging.js'
import Uuid = types.Uuid

// returns now date because cassandra-driver is retarded    
export const now = () => new Date()

export const upsertArtistScrobble = async (client: Client, fmUsername: string, artistMbid: string, playCount: number) => {
  const itemId = Uuid.random()
  const query = `
    INSERT INTO artist_scrobbles (fmUsername, artistMbid, playCount, id, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)
    IF NOT EXISTS;
  `
  const n = now()
  const r = await client.execute(query, [fmUsername, artistMbid, playCount, itemId, n, n], { prepare: true }).catch((e) => {
    error('graphEngine.upsertArtistScrobble', e.stack)
    throw e
  })

  if (r.first()) {
    return r.rows[0]
  } else {
    return await client.execute(`
      UPDATE artist_scrobbles
      SET playCount = ? AND updatedAt = ?
      WHERE fmUsername = ? AND artistMbid = ?;
    `, [playCount, fmUsername, artistMbid, now()], { prepare: true })
  }
}

export const getArtistScrobble = async (client: Client, fmUsername: string, artistMbid: string) => {
  const query = `
    SELECT * FROM artist_scrobbles
    WHERE fmUsername = ? AND artistMbid = ?;
  `
  debug('graphEngine.getArtistScrobble', `getting artist scrobble for ${fmUsername} on ${artistMbid}`)
  const r = await client.execute(query, [fmUsername, artistMbid], { prepare: true })
  return r.first()
}

export const getArtistScrobbleByID = async (client: Client, artistScrobbleId: string) => {
  const query = `
    SELECT * FROM artist_scrobbles
    WHERE id = ?;
  `
  const r = await client.execute(query, [artistScrobbleId], { prepare: true })
  return r.first()
}

// returns the crown for the given group id, with the artist scrobble data
export const getCrown = async (client: Client, groupId: string, artistMbid: string) => {
  const query = `
    SELECT * FROM crowns
    WHERE groupId = ? AND artistScrobbleId = ?;
  `
  const r = await client.execute(query, [groupId, artistMbid], { prepare: true })
  return r.first()
}

export const getUserCrowns = async (client: Client, groupId: string, fmUsername: string) => {
  const query = `
    SELECT * FROM crowns
    WHERE groupId = ? AND fmUsername = ?;
  `
  const r = await client.execute(query, [groupId, fmUsername], { prepare: true })
  return r.rows
}

export const upsertCrown = async (client: Client, groupId: string, artistMbid: string, artistScrobbleId: string, fmUsername: string, playCount: number) => {
  const query = `
    INSERT INTO crowns (groupId, artistmbid, artistScrobbleId, fmUsername, playCount, id, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    IF NOT EXISTS;
  `
  const n = now()
  const id = Uuid.random()
  const r = await client.execute(query, [groupId, artistMbid, artistScrobbleId, fmUsername, playCount, id, n, n], { prepare: true })
  if (r.first()) {
    return r.rows[0]
  } else {
    return await client.execute(`
      UPDATE crowns
      SET playCount = ? AND updatedAt = ?
      WHERE groupId = ? AND artistScrobbleId = ?;
    `, [playCount, groupId, artistMbid, now()], { prepare: true })
  }
}

export const updateCrownPlayCount = async (client: Client, crownId: string, playCount: number) => {
  return await client.execute(`
    UPDATE crowns
    SET playCount = ? AND updatedAt = ?
    WHERE id = ?;
  `, [playCount, crownId, now()], { prepare: true })
}

export const tryGetToCrown = async (client: Client, groupId: string, artistMbid: string, fmUsername: string): Promise<boolean> => {
  // first, we must get the fmUser's artist scrobble
  const artistScrobble = await getArtistScrobble(client, fmUsername, artistMbid).catch((e) => {
    error('graphEngine.tryGetToCrown', 'failed to get artist scrobble: ' + e.stack)
    throw e
  })

  if (!artistScrobble) {
    return false
  }

  // now, we compare the artist scrobble's playCount to the crown's playCount
  const crown = await getCrown(client, groupId, artistMbid).catch((e) => {
    error('graphEngine.tryGetToCrown', 'failed to get crown: ' + e.stack)
    throw e
  })
  if (!crown) {
    // if it doesn't exist, the user can get the crown
    await upsertCrown(client, groupId, artistMbid, artistScrobble.id, fmUsername, artistScrobble.playCount)
    return true
  }

  if (artistScrobble.playCount > crown.playCount) {
    // now, just to be sure, we get the artistscrobbleid from the crown and check if it's still less than fmUser's playCount
    const artistScrobbleId = crown.artistScrobbleId
    const artistScrobbleFromCrown = await getArtistScrobbleByID(client, artistScrobbleId)
    if (artistScrobble.playCount > artistScrobbleFromCrown.playCount) {
      // if it is, we give the crown to the other user
      await client.execute(`
        UPDATE crowns
        SET fmUsername = ?, playCount = ?, artistscrobbleid = ?, updatedAt = ?
        WHERE id = ?;
      `, [fmUsername, artistScrobble.playCount, artistScrobble.id, crown.id, now()], { prepare: true }).catch((e) => {
        error('graphEngine.tryGetToCrown', 'failed to update crown: ' + e.stack)
        throw e
      })
      return true
    } else {
      // if it's not, we update the play count
      await updateCrownPlayCount(client, crown.id, artistScrobble.playCount).catch((e) => {
        error('graphEngine.tryGetToCrown', 'failed to update crown: ' + e.stack)
        throw e
      })
      return false
    }
  } else {
    return false
  }
}

export const addUserToGroupList = async (client: Client, groupId: string, fmUsername: string) => {
  const n = now()
  const id = Uuid.random()
  return await client.execute(`
    INSERT INTO group_members (groupId, fmUsername, id, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?)
    IF NOT EXISTS;
  `, [groupId, fmUsername, id, n, n], { prepare: true })
}