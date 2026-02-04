import { error } from '@/logging/logging'

export const start = () => {
    if (!process.env.DITTO_URL) {
        error('internal.main', 'DITTO_URL is not set')
        process.exit(1)
    }
}
