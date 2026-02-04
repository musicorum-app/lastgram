import { Context } from '@/multiplatforms/common/context'
import { inspect } from 'node:util'

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
