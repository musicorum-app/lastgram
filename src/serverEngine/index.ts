// @ts-ignore
import polka from 'polka'
import { info } from '../loggingEngine/logging.js'
// @ts-ignore
import { json } from '@polka/parse'
import { register } from '../loggingEngine/prometheus.js'
import { send } from './utils.js'
import metricMiddleware, { MonitoredRequest } from '../loggingEngine/middleware.js'

const PORT = process.env.PORT || 3000
export const SERVER_URL = process.env.SERVER_URL || 'http://localhost:' + PORT

const server = polka()
server.use(json())
server.use(metricMiddleware)

server.get('/metrics', async (req: Request, res: MonitoredRequest) => {
  send(res, 200, await register.metrics(), { 'Content-Type': register.contentType })
})

/**
 serverEngine.post('/generate', async (req, res) => {
  const data = req.body as GenerateData
  const { error, message, id, time } = await generate(data)
  if (error) {
    send(res, 400, { error: true, message })
  } else {
    send(res, 200, { error: false, file: `${id}.jpg`, url: `${SERVER_URL}/results/${id}.jpg`, time })
  }
})*/

export const start = async () => {
  server.listen(PORT, () => {
    info('serverEngine.start', `listening on port ${PORT}`)
  })
}