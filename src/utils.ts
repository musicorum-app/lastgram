import { createHash } from 'node:crypto'

export const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV !== 'production' || process.env.DEBUGGING === 'true'

export const hashName = (str: string) => {
    return createHash('md5').update(str).digest('hex')
}
