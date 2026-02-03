import client from "prom-client"
import { isDevelopment } from "../utils.js"

export const register = new client.Registry()

export const prefixed = (name: string) =>
    `lg${isDevelopment ? "_dev" : ""}_${name}`

//client.collectDefaultMetrics({
//  prefix: prefixed(''),
//  register
//})
