import { createKeyspace, createTables } from './migrations.js'
import { Client } from 'cassandra-driver'
import { debug, error } from '../loggingEngine/logging.js'

export const client = new Client({
  contactPoints: [process.env.CASSANDRA_HOST || 'localhost'],
  localDataCenter: 'datacenter1'
})

export const start = async () => {
  await client.connect().then(() => debug('graphEngine.main', 'connected to database'))
  await createKeyspace(client).then(() => debug('graphEngine.main', 'keyspace created')).catch((e) => error('graphEngine.main', e.stack))
  client.keyspace = 'lastgram'

  await createTables(client).then(() => debug('graphEngine.main', 'tables created')).catch((e) => error('graphEngine.main', e.stack))
}

