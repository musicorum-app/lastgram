export interface CommandAdvancedReply {
  content?: string
  imageUrl?: string
  sendAsPhoto?: boolean
}

export type CommandReply = string | number | CommandAdvancedReply
