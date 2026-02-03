import client from 'prom-client'
import { prefixed, register } from './prometheus.js'

export const newCounter = (name: string, help: string, labelNames: string[] | undefined) => {
    const counter = new client.Counter({
        name: prefixed(name),
        help: help,
        labelNames: labelNames
    })
    register.registerMetric(counter)
    return counter
}

export const newHistogram = (name: string, help: string, labelNames: string[]) => {
    const histogram = new client.Histogram({
        name: prefixed(name),
        help: help,
        labelNames: labelNames,
        buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] // 0.1 to 10 seconds
    })
    register.registerMetric(histogram)
    return histogram
}
