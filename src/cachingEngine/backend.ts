export abstract class CachingBackend {
  abstract get (key: string): Promise<string | undefined>

  abstract set (key: string, value: string): Promise<void>

  abstract setTTL (key: string, value: string, ttl: number): Promise<void>

  abstract delete (key: string): Promise<void>

  abstract clear (): Promise<void>

  async quickSave (data: string) {
    const id = randomString()
    await this.setTTL(id, data, 5 * 60 * 1000)
    return id
  }

  async quickEdit (id: string, data: string) {
    await this.setTTL(id, data, 5 * 60 * 1000)
  }
}

// random 12 character string
const randomString = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
