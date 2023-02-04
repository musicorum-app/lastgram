// @ts-ignore
import polkaSend from '@polka/send-type'
import { MonitoredRequest } from '../loggingEngine/middleware.js'

export const send = (res: MonitoredRequest, code: number, body: any, headers?: Record<string, string | number>) => {
  if (res.done) {
    res.done({ method: res.data.method, route: res.data.route, code })
  }

  return polkaSend(res, code, body, headers)
}