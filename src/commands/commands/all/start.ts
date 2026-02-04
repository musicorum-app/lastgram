import { Context } from '@/multiplatforms/common/context'

export default async (ctx: Context) => {
    ctx.reply('commands:help.text')
}

export const info = {
    hidden: true
}
