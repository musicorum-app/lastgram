import { client } from './index.js'
import { backend } from '../caching'
import { updateUserByID } from '../database'

export const prepareForAuth = async (id: number) => {
    const token = await client.auth.getToken()
    const url = client.utilities.buildDesktopAuthURL(token)
    await backend!.setTTL(`fm_pending_auth_${id}`, token, 60 * 60 * 1000)
    return url
}

export const finishAuth = async (id: number) => {
    const token = await backend!.get(`fm_pending_auth_${id}`)
    if (!token) return undefined


    const session = await client.auth.getSession(token).catch(() => undefined)
    if (!session) return undefined

    await updateUserByID(id, {
        sessionKey: session.key
    })

    await backend!.delete(`fm_pending_auth_${id}`)
    return session
}
