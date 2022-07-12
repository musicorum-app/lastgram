export abstract class Platform {
  abstract start(): Promise<any>
  abstract stop(): any
}
