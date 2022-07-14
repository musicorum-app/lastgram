import { DesperadoClient } from '../Desperado.js'

interface ParsedCommandText {
  commandName: string
  args: string[]
}

export default class Utils {
  client: DesperadoClient

  constructor(client: DesperadoClient) {
    this.client = client
  }

  parseArgs(text: string): ParsedCommandText | undefined {
    if (!text.startsWith('/')) return undefined
    const [rawCommandName, ...args] = text
      .split(' ')
      .filter((a) => a)
      .map((a) => a.trim())
    if (
      rawCommandName.includes('@') &&
      !rawCommandName.includes(this.client.me.username)
    )
      return undefined

    const commandName = rawCommandName
      .replace('/', '')
      .replace(`@${this.client.me.username}`, '')

    return {
      commandName,
      args
    }
  }
}
