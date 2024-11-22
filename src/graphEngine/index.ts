import { createKeyspace, createTables } from './migrations.js'
import { Client } from 'cassandra-driver'
import { debug, error } from '../loggingEngine/logging.js'
import { getCrown, upsertArtistScrobble, getUserCrowns, tryGetToCrown, addUserToGroupList } from './operations.js'

const client = new Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1'
})

class GraphEngine {
  hasStarted: boolean = false
  client: Client | undefined = undefined

  upsertScrobbles (fmUsername: string, artistMbid: string, playCount: number) {
    if (!this.hasStarted) {
      throw new Error('GraphEngine has not started')
    }
    debug('graphEngine.upsertScrobbles', `upserting scrobbles for ${fmUsername} on ${artistMbid} with playcount ${playCount}`)
    return upsertArtistScrobble(this.client!, fmUsername, artistMbid, playCount)
  }

  getCrownOnGroup (groupId: string, artistMbid: string) {
    if (!this.hasStarted) {
      throw new Error('GraphEngine has not started')
    }
    return getCrown(this.client!, groupId, artistMbid)
  }

  getUserCrowns (groupId: string, fmUsername: string) {
    if (!this.hasStarted) {
      throw new Error('GraphEngine has not started')
    }
    return getUserCrowns(this.client!, groupId, fmUsername)
  }

  tryToStealCrown (groupId: string, artistMbid: string, fmUsername: string) {
    if (!this.hasStarted) {
      throw new Error('GraphEngine has not started')
    }
    return tryGetToCrown(this.client!, groupId, artistMbid, fmUsername)
  }

  addMemberToGroupList (groupId: string, fmUsername: string) {
    if (!this.hasStarted) {
      throw new Error('GraphEngine has not started')
    }
    return addUserToGroupList(this.client!, groupId, fmUsername).then(() => debug('graphEngine.addMemberToGroupList', `added ${fmUsername} to group ${groupId}`))
  }

  setClient (client: Client) {
    this.client = client
    this.hasStarted = true
  }
}

export const graphEngine = new GraphEngine()

export const start = async () => {
  await client.connect().then(() => debug('graphEngine.main', 'connected to database'))
  await createKeyspace(client).then(() => debug('graphEngine.main', 'keyspace created')).catch((e) => error('graphEngine.main', e.stack))
  client.keyspace = 'lastgram'

  await createTables(client).then(() => debug('graphEngine.main', 'tables created')).catch((e) => error('graphEngine.main', e.stack))
  graphEngine.setClient(client)
}

