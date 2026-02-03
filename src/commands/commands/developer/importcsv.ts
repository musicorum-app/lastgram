import { Context } from '../../../multiplatforms/common/context.js'
import { client } from '../../../database'

type Args = {
    url: string
}

const parseCSV = (csv: string) => {
    const lines = csv.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim())
    const data = []

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue // Skip empty lines

        // Simple CSV parsing - handles basic cases
        const values = lines[i].split(',')
        const row: any = {}

        headers.forEach((header, index) => {
            row[header] = values[index]?.trim() || ''
        })

        // Only add rows that have required fields
        if (row.pid && row.lfm_username) {
            data.push(row)
        }
    }

    return data
}

export default async (
    ctx: Context,
    { url }: Args
) => {
    try {
        await ctx.reply('⏳ Fetching CSV from URL...')

        // Fetch the CSV from the URL
        const response = await fetch(url)
        if (!response.ok) {
            return ctx.reply(`❌ Failed to fetch CSV: ${response.statusText}`)
        }

        const csvText = await response.text()
        const rows = parseCSV(csvText)

        if (rows.length === 0) {
            return ctx.reply('❌ No valid rows found in CSV')
        }

        await ctx.reply(`📊 Found ${rows.length} rows to process. Starting import...`)

        let created = 0
        let skipped = 0
        let errors = 0
        const errorDetails: string[] = []

        // Process each row
        for (const row of rows) {
            try {
                // Check if user already exists
                const existing = await client.user.findUnique({
                    where: { platformId: row.pid }
                })

                if (existing) {
                    skipped++
                    continue
                }

                // Create the user
                await client.user.create({
                    data: {
                        platformId: row.pid,
                        fmUsername: row.lfm_username,
                        isBanned: row.banned === 'true',
                        // All other fields will use defaults from the schema
                    }
                })
                created++
            } catch (error: any) {
                errors++
                errorDetails.push(`${row.pid}: ${error.message}`)
            }
        }

        let resultMessage =
            `✅ Import complete!\n` +
            `📊 Total rows: ${rows.length}\n` +
            `✅ Created: ${created}\n` +
            `⏭️ Skipped (already exists): ${skipped}\n` +
            `❌ Errors: ${errors}`

        if (errorDetails.length > 0 && errorDetails.length <= 5) {
            resultMessage += '\n\nError details:\n' + errorDetails.join('\n')
        } else if (errorDetails.length > 5) {
            resultMessage += '\n\nShowing first 5 errors:\n' + errorDetails.slice(0, 5).join('\n')
        }

        return ctx.reply(resultMessage)
    } catch (error: any) {
        return ctx.reply(`❌ Error: ${error.message}`)
    }
}

export const info = {
    args: [{
        name: 'url',
        required: true,
        everythingAfter: true
    }]
}
