import { Context } from '../../../multiplatforms/common/context.js'
import { inspect } from 'node:util'
import { client } from '../../../database/index.js'
import { sleep } from 'bun'

const clean = async (val: any) => {
    if (val && val.constructor?.name === 'Promise') val = await val
    if (typeof val !== 'string') val = inspect(val, { depth: 2 })

    for (const envKey of Object.keys(process.env)) {
        if (!process.env[envKey]) continue
        val = val.replaceAll(process.env[envKey], `<env:${envKey}>`)
    }

    return val.replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
}

type Args = {
    code: string
}

export default async (ctx: Context, { code }: Args) => {
    if (!code.includes('\n')) code = `(async () => (${code}))()`

    const time = Date.now()
    let r
    try {
        r = await eval(code)
        r = await clean(r)
    } catch (e: any) {
        r = e?.message || e
    }

    return ctx.reply('commands:eval', {
        code,
        output: r,
        time: Date.now() - time
    })
}

export const info = {
    args: [{
        name: 'code',
        required: true,
        everythingAfter: true
    }]
}

// {"id":28144,"inserted_at":"2024-10-07 22:50:31.614621+00","updated_at":"2024-10-07 22:50:31.614621+00","pid":7602811788,"lfm_username":"leobshlz","layout":"default","banned":false}
interface OldDBUser {
    id: number
    inserted_at: string
    updated_at: string
    pid: number
    lfm_username: string
    layout: string
    banned: boolean
}

async function runMigrate(url: string) {
    const d = await fetch(url, {
        method: 'GET',
        headers: {
            Cookie: 'verified=2025-02-23',
            'User-Agent': 'curl/7.68.0',
            Accept: '*/*'
        }
    }).then(a => a.json())
    await migrateUsers(d)
}

async function migrateUsers(users: OldDBUser[]) {
    // chunk in 1000
    const chunks = []
    for (let i = 0; i < users.length; i += 1000) {
        chunks.push(users.slice(i, i + 1000))
    }

    let i = 0
    for (const chunk of chunks) {
        await Promise.all(chunk.map(upsert))
        i++
        console.log(`chunk ${i}/${chunks.length} done`)
        sleep(1000)
    }
}

async function upsert(user: OldDBUser) {
    if (!user.lfm_username) return
    if (!user.pid) return

    await client.user.upsert({
        create: {
            platformId: `telegram_${user.pid}`,
            fmUsername: user.lfm_username.toString(),
            isBanned: user.banned,
            language: 'pt'
        },
        update: {},
        where: {
            platformId: `telegram_${user.pid}`
        }
    })
}
