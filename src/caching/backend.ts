export abstract class CachingBackend {
  abstract get (key: string): Promise<string | undefined>

  abstract set (key: string, value: string): Promise<void>

  abstract setTTL (key: string, value: string, ttl: number): Promise<void>

  abstract delete (key: string): Promise<void>

  abstract clear (): Promise<void>
}