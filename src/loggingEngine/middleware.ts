import { httpRequest } from './metrics.js'

export interface MonitoredRequest extends Request {
  data: {
    method: string
    route: string
  }

  done: (data: { method: string, route: string, code: number }) => void
}

export default (req: Request, res: MonitoredRequest, next: () => void) => {
  res.done = httpRequest.startTimer()

  res.data = {
    method: req.method,
    route: req.url
  }
  next()
}