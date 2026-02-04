import { Context } from '@/multiplatforms/common/context'
import { buildCommandUsage } from '../../command.js'

type Args = {
    command: string
}

export default (ctx: Context, { command }: Args) => {
    if (command) {
        const cmd = ctx.runner.findCommand(command)
        if (!cmd) return ctx.reply('commands:help.notFound')
        const usage = buildCommandUsage(cmd, ctx.language)
        return ctx.reply('commands:help.commandInfo', {
            name: cmd.name,
            description: ctx.t(`descriptions:${cmd.name}`),
            usage
        })
    }
    return ctx.reply('commands:help.text')
}

export const info = {
    aliases: ['ajuda'],
    args: [{
        name: 'command',
        required: false
    }]
}
