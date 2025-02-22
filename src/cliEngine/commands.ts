import { updateDiscordCommands as udc } from '../multiplatformEngine/utilities/discord.js'
import { checkTranslations as ct } from './commands/translations.js'

export const updateDiscordCommands = () => udc()
export const checkTranslations = () => ct()