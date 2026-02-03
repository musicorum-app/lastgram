import { updateDiscordCommands as udc } from '../multiplatforms/utilities/discord.js'
import { checkTranslations as ct } from './commands/translations.js'

export const updateDiscordCommands = () => udc()
export const checkTranslations = () => ct()