import { Client } from 'cassandra-driver'

export const createKeyspace = async (client: Client) => {
  const query = `CREATE KEYSPACE IF NOT EXISTS lastgram WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 3};`
  await client.execute(query)
}

// creates the artist scrobble table. has fmUsername, artistMbid and playCount, id, createdAt, updatedAt
// also creates the crown table. references the artist scrobble table and has group id, created at, updated at, id
export const createTables = async (client: Client) => {
  const query = `
    CREATE TABLE IF NOT EXISTS artist_scrobbles (
      playCount int,
      fmUsername text,
      artistMbid text,
      createdAt timestamp,
      updatedAt timestamp,
      PRIMARY KEY (fmUsername, artistMbid)
    );
`

  const query2 = `
    CREATE TABLE IF NOT EXISTS crowns (
      artistMbid text,
      groupId text,
      fmUsername text,
      playCount int,
      switchedtimes int,
      createdAt timestamp,
      updatedAt timestamp,
      PRIMARY KEY (groupId, artistMbid)
    );
  `

  // past holders of a crown
  const querych = `
    CREATE TABLE IF NOT EXISTS crown_holders (
      artistMbid text,
      groupId text,
      fmUsername text,
      playCount int,
      createdAt timestamp,
      PRIMARY KEY (groupId, artistMbid, fmUsername)
    );
  `

  // artist name to mbid mapping
  const query4 = `
    CREATE TABLE IF NOT EXISTS artist_mbid_map (
      artistName text,
      artistMbid text,
      artistCover text,
      PRIMARY KEY (artistName, artistMbid)
    );
  `

  await client.execute(query)
  await client.execute(query2)
  await client.execute(querych)
  await client.execute(query4)

  // create index w 2 columns, artistScrobbleId and groupId


  // create table for group members
  const query3 = `
    CREATE TABLE IF NOT EXISTS group_members (
      groupId text,
      fmUsername text,
      createdAt timestamp,
      updatedAt timestamp,
      PRIMARY KEY (groupId, fmUsername)
    );
  `

  await client.execute(query3)
}



