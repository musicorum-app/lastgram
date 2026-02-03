import { CachedUserData, Context } from '../multiplatforms/common/context.js'
import { error } from '../logging/logging.js'
import { User } from '../multiplatforms/common/user.js'

export interface GuardData {
    targetedUserData?: CachedUserData
    targetedUser?: User
    registeredUserData?: CachedUserData
    registeredUser?: User
}

export const all = () => true

export const targeted = async (ctx: Context) => {
    if (!ctx.message.replyingToUser) {
        ctx.reply('errors:guards.targetable.userNotMentioned')
        return false
    }
    const u = await ctx.getUserData(ctx.message.replyingToUser, 'targetedUserData')
    if (!u) {
        ctx.reply('errors:guards.targetable.userMentionedNotRegistered')
        return false
    }
    if (u.isBanned) {
        ctx.reply('errors:guards.targetable.userMentionedBanned')
        return false
    }
    ctx.setGuardData('targetedUser', ctx.message.replyingToUser)
    return true
}

export const targetable = async (ctx: Context) => {
    if (ctx.message.replyingToUser) {
        const u = await ctx.getUserData(ctx.message.replyingToUser, 'registeredUserData')
        if (!u) {
            ctx.reply('errors:guards.targetable.userMentionedNotRegistered')
            return false
        }
        if (u.isBanned) {
            ctx.reply('errors:guards.targetable.userMentionedBanned')
            return false
        }
        ctx.setGuardData('targetedUser', ctx.message.replyingToUser)
    } else {
        const u = await ctx.getUserData(ctx.author, 'registeredUserData')
        if (!u) {
            ctx.reply('errors:guards.registered.userNotRegistered')
            return false
        }
        if (u.isBanned) {
            ctx.reply('errors:guards.registered.userBanned')
            return false
        }
        ctx.setGuardData('registeredUser', ctx.author)
    }
    return true
}

export const registered = async (ctx: Context) => {
    if (!ctx.guardData.registeredUserData) {
        ctx.reply('errors:guards.registered.userNotRegistered')
        return false
    }
    if (ctx.guardData.registeredUserData.isBanned) {
        ctx.reply('errors:guards.registered.userBanned')
        return false
    }

    return true
}

export const linked = async (ctx: Context) => {
    if (!ctx.guardData.registeredUserData) {
        ctx.reply('errors:guards.registered.userNotRegistered')
        return false
    }
    if (ctx.guardData.registeredUserData.isBanned) {
        ctx.reply('errors:guards.registered.userBanned')
        return false
    }
    if (!ctx.guardData.registeredUserData.sessionKey) {
        ctx.reply('errors:guards.notLinked')
        return false
    }
    return true
}

export const onlyDMs = (ctx: Context) => {
    if (ctx.message.platform === 'telegram' && ctx.channel.id === ctx.author.id) return true
    if (ctx.message.platform === 'discord' && ctx.channel.type === 'dm') return true
    ctx.reply('errors:guards.onlyDMs')
    return false
}

export const noDMs = (ctx: Context) => {
    if (ctx.message.platform === 'telegram' && ctx.channel.id !== ctx.author.id) return true
    if (ctx.message.platform === 'discord' && ctx.channel.type !== 'dm') return true
    ctx.reply('errors:guards.noDMs')
    return false
}

export const developer = (ctx: Context) => {
    const ids = ['918911149595045959', '205873263258107905', '268526982222970880', '1889562226', '5067918490']
    if (ids.includes(ctx.author.id.toString())) return true
    ctx.reply('errors:guards.developer')
    return false
}

export const unknown = (ctx: Context) => {
    error('commands.guards', `commands with the unknown protection level cannot be executed`)
    ctx.reply('errors:unknown')
    return false
}
