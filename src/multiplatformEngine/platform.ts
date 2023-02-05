import { newCounter } from '../loggingEngine/metrics.js'
import { Counter } from 'prom-client'
import { error } from '../loggingEngine/logging.js'

export class Platform {
  private counter: Counter
  private readonly internalCounters: { [key: string]: Counter }

  constructor (
    public name: string
  ) {
    this.counter = newCounter(
      `platform_${name}_total_handled_messages`,
      `Total number of messages handled by the ${name} platform`,
      []
    )

    this.internalCounters = {}
  }

  start () {
    error(`platforms.${this.name}`, 'start() not implemented')
  }

  stop () {
    error(`platforms.${this.name}`, 'stop() not implemented')
  }

  protected createCounter (name: string, help: string, labelNames?: string[]) {
    const counter = newCounter(name, help, labelNames)
    this.internalCounters[name] = counter
    return counter
  }

  protected getCounter (name: string) {
    return this.internalCounters[name]
  }

  protected incrementMessages (increment = 1) {
    this.counter.inc(increment)
  }
}