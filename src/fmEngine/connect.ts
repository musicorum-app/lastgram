import { client } from './index.js'
import { backend } from '../cachingEngine/index.js'
import { updateUserByID } from '../database.js'

const prepareForAuth = async (id: number) => {
  const token: string = client.auth.getToken()
  const url = client.utilities.buildDesktopAuthURL(token)
  await backend().setTTL(`fm_pending_auth_${id}`, token, 60 * 60)
  return url
}

const finishAuth = async (id: number) => {
  const token = await backend().get(`fm_pending_auth_${id}`)
  if (!token) return undefined

  const session = await client.auth.getSession(token)
  updateUserByID(id, {
    sessionKey: session.key
  })

  await backend().delete(`fm_pending_auth_${id}`)
  return session
}