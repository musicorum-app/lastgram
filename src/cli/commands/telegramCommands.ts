import fs from 'fs'
import { commandRunner } from '@/commands'
import Telegram from '@/multiplatforms/platforms/telegram'
import { info, error, bold } from '@/logging/logging'

export const updateTelegramCommands = async (dryRun = false) => {
    info('cli.telegramCommands', `Updating Telegram commands... (dryRun: ${dryRun})`)

    const targetCommands = Array.from(commandRunner.commands.values()).filter(cmd => {
        if (cmd.hidden) return false
        if (cmd.protectionLevel.includes('developer')) return false
        if (cmd.disabledPlatforms?.includes('telegram')) return false
        return true
    })

    const locales = fs.readdirSync('assets/locales').filter(l => fs.statSync(`assets/locales/${l}`).isDirectory())

    const telegram = new Telegram()

    for (const locale of locales) {
        const languageCode = locale.split('-')[0]

        const descriptionsPath = `assets/locales/${locale}/descriptions.json`
        let descriptions: Record<string, string> = {}
        if (fs.existsSync(descriptionsPath)) {
            descriptions = JSON.parse(fs.readFileSync(descriptionsPath, 'utf-8'))
        }

        const botCommands = targetCommands.map(cmd => {
            const desc = descriptions[cmd.name]
            if (!desc) {
                const enDesc = JSON.parse(fs.readFileSync('assets/locales/en/descriptions.json', 'utf-8'))[cmd.name]
                return { command: cmd.name, description: enDesc || 'No description provided' }
            }
            return { command: cmd.name, description: desc }
        })

        info('cli.telegramCommands', `Preparing to send ${botCommands.length} commands for locale ${bold(locale)} (mapped to language_code: ${languageCode === 'en' ? 'default' : languageCode})`)

        if (dryRun) {
            console.log(`[DRY RUN] Would send to Telegram (language_code: ${languageCode === 'en' ? 'undefined' : languageCode}):`)
            console.log(botCommands.map(c => `/${c.command} - ${c.description}`).join('\n'))
            continue
        }

        try {
            await telegram.request('setMyCommands', {
                commands: botCommands,
                language_code: languageCode === 'en' ? undefined : languageCode
            })
            info('cli.telegramCommands', `Successfully updated commands for ${locale}`)
        } catch (e: any) {
            error('cli.telegramCommands', `Failed to update commands for ${locale}: ${e.message}`)
        }
    }

    info('cli.telegramCommands', 'Done updating Telegram commands.')
}
