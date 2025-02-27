import { client } from './index.js'
import { error } from '../loggingEngine/logging.js'
import { hashName } from '../utils.js'

// returns now date because cassandra-driver is retarded    
export const now = () => new Date()

export const addUserToGroupList = async (groupId: string, fmUsername: string) => {
  const n = now()
  return await client.execute(`
      INSERT INTO group_members (groupId, fmUsername, createdAt, updatedAt)
      VALUES (?, ?, ?, ?) IF NOT EXISTS;
  `, [groupId, fmUsername.toLowerCase(), n, n], { prepare: true }).catch((e) => {
    error('graphEngine.addUserToGroupList', e.stack)
    throw e
  })
}

export const linkArtistNameToMbid = async (artistName: string, artistMbid: string | undefined, photoUrl: string | undefined) => {
  return await client.execute(`
      INSERT INTO artist_mbid_map (artistName, artistMbid, artistCover)
      VALUES (?, ?, ?) IF NOT EXISTS;
  `, [artistName, artistMbid || hashName(artistName), photoUrl], { prepare: true }).catch((e) => {
    error('graphEngine.linkArtistNameToMbid', e.stack)
    throw e
  })
}

export const getArtistDataByMbid = async (artistMbid: string) => {
  const query = `
      SELECT artistName, artistCover
      FROM artist_mbid_map
      WHERE artistMbid = ?;
  `
  const r = await client.execute(query, [artistMbid], { prepare: true }).catch((e) => {
    error('graphEngine.getArtistNameFromMbid', e.stack + ' ' + artistMbid)
    throw e
  })

  return { name: r.rows[0]?.artistname, cover: r.rows[0]?.artistcover }
}

export const updateAllFmUsernameToBeLowercase = async () => {
  const query = `
      SELECT *
      FROM crowns;
  `
  const r = await client.execute(query, [], { prepare: true }).catch((e) => {
    error('graphEngine.updateAllFmUsernameToBeLowercase', e.stack)
    throw e
  })

  for (const row of r.rows) {
    await client.execute(`
        UPDATE crowns
        SET fmUsername = ?
        WHERE groupId = ?
          AND artistMbid = ?;
    `, [row.fmusername.toLowerCase(), row.groupid, row.artistmbid], { prepare: true }).catch((e) => {
      error('graphEngine.updateAllFmUsernameToBeLowercase', e.stack)
      throw e
    })
  }

  const query2 = `
      SELECT *
      FROM group_members;
  `

  const r2 = await client.execute(query2, [], { prepare: true }).catch((e) => {
    error('graphEngine.updateAllFmUsernameToBeLowercase', e.stack)
    throw e
  })

  for (const row of r2.rows) {
    await client.execute(`
        UPDATE group_members
        SET fmUsername = ?
        WHERE groupId = ?
          AND fmUsername = ?;
    `, [row.fmusername.toLowerCase(), row.groupid, row.fmusername], { prepare: true }).catch((e) => {
      error('graphEngine.updateAllFmUsernameToBeLowercase', e.stack)
      throw e
    })
  }

  const query3 = `
      SELECT *
      FROM crown_holders;
  `

  const r3 = await client.execute(query3, [], { prepare: true }).catch((e) => {
    error('graphEngine.updateAllFmUsernameToBeLowercase', e.stack)
    throw e
  })

  for (const row of r3.rows) {
    await client.execute(`
        UPDATE crown_holders
        SET fmUsername = ?
        WHERE groupId = ?
          AND artistMbid = ?
          AND fmUsername = ?;
    `, [row.fmusername.toLowerCase(), row.groupid, row.artistmbid, row.fmusername], { prepare: true }).catch((e) => {
      error('graphEngine.updateAllFmUsernameToBeLowercase', e.stack)
      throw e
    })
  }

  // count how many crowns user camilaloures has
  // SELECT COUNT(*) FROM crowns WHERE fmUsername = 'camilaloures';
}