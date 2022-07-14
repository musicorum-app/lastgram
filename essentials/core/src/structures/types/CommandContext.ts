export interface CommandContextUser {
  firstName: string
  lastName?: string
  languageCode?: string
  id: string
}

export interface CommandContextChannel {
  name?: string
  id: string
}

export interface CommandContext {
  id: string
  content: string
  args?: string[]
  platform: string
  author: CommandContextUser
  channel: CommandContextChannel
}
