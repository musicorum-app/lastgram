import { newHistogram } from './metrics.js'

const httpRequest = newHistogram('http_request_duration_seconds', 'Duration of HTTP requests in seconds', ['method', 'route', 'code'])

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