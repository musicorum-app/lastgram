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
  `, [groupId, fmUsername, n, n], { prepare: true }).catch((e) => {
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