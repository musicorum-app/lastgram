import { updateDiscordCommands as udc } from '../multiplatforms/utilities/discord.js'
import { checkTranslations as ct, checkStructure as cs } from './commands/translations.js'
import { checkCommands as cc } from './commands/commands.js'
import { updateTelegramCommands as utc } from './commands/telegramCommands.js'

export const updateDiscordCommands = () => udc()
export const checkTranslations = () => ct()
export const checkStructure = () => cs()
export const checkCommands = async () => cc()
export const updateTelegramCommands = async (...args: any[]) => utc(args.includes('--dry-run'))