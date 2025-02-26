import { client } from '../index.js'
import { debug, error } from '../../loggingEngine/logging.js'
import { now } from '../operations.js'

export const upsertArtistScrobbles = async (fmUsername: string, artistMbid: string, playCount: number) => {
  const query = `
      INSERT INTO artist_scrobbles (playCount, createdAt, updatedAt, fmUsername, artistMbid)
      VALUES (?, ?, ?, ?, ?) IF NOT EXISTS;
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

export const getArtistScrobble = async (fmUsername: string, artistMbid: string) => {
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