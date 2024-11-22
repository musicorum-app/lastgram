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
      fmUsername text,
      artistMbid text,
      playCount int,
      id uuid PRIMARY KEY,
      createdAt timestamp,
      updatedAt timestamp
    );
`

  const query2 = `
    CREATE TABLE IF NOT EXISTS crowns (
      artistScrobbleId uuid,
      artistMbid text,
      groupId uuid,
      fmUsername text,
      playCount int,
      createdAt timestamp,
      updatedAt timestamp,
      id uuid PRIMARY KEY
    );
  `
  await client.execute(query)
  await client.execute(query2)

  // create indexes for artist scrobbles w fmUsername and artistMbid
  await client.execute(`CREATE INDEX IF NOT EXISTS ON artist_scrobbles(fmUsername);`)
  await client.execute(`CREATE INDEX IF NOT EXISTS ON artist_scrobbles(artistMbid);`)

  // create indexes for crowns w artistScrobbleId and groupId
  await client.execute(`CREATE INDEX IF NOT EXISTS ON crowns(artistScrobbleId);`)
  await client.execute(`CREATE INDEX IF NOT EXISTS ON crowns(groupId);`)

  // create table for group members
  const query3 = `
    CREATE TABLE IF NOT EXISTS group_members (
      groupId text,
      fmUsername text,
      createdAt timestamp,
      updatedAt timestamp,
      id uuid PRIMARY KEY
    );
  `

  await client.execute(query3)

  // create indexes for group members w groupId and fmUsername
  await client.execute(`CREATE INDEX IF NOT EXISTS ON group_members(groupId);`)
  await client.execute(`CREATE INDEX IF NOT EXISTS ON group_members(fmUsername);`)
}



