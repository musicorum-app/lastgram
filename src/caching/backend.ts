import crypto from 'crypto'

export abstract class CachingBackend {
    abstract get(key: string): Promise<string | undefined>

    abstract set(key: string, value: string): Promise<void>

    abstract setTTL(key: string, value: string, ttl: number): Promise<void>

    abstract delete(key: string): Promise<void>

    abstract clear(): Promise<void>

    async quickSave(data: string) {
        const id = randomString()
        await this.setTTL(id, data, 5 * 60 * 1000)
        return id
    }

    async quickEdit(id: string, data: string) {
        await this.setTTL(id, data, 5 * 60 * 1000)
    }
}

// random 32 character string
const randomString = () => crypto.randomBytes(16).toString('hex')
