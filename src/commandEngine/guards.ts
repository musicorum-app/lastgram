import { Context } from '../multiplatformEngine/common/context.js'
import { error } from '../loggingEngine/logging.js'

export const all = () => true

export const targetable = async (ctx: Context) => {
  if (ctx.message.replyingToUser) {
    const u = await ctx.getUserData(ctx.message.replyingToUser)
    if (!u) {
      ctx.reply('errors:guards.targetable.userMentionedNotRegistered')
      return false
    }
    if (u.isBanned) {
      ctx.reply('errors:guards.targetable.userMentionedBanned')
      return false
    }
    ctx.targetedUser = ctx.message.replyingToUser
  } else {
    const u = await ctx.getUserData()
    if (!u) {
      ctx.reply('errors:guards.targetable.userNotRegistered')
      return false
    }
    if (u.isBanned) {
      ctx.reply('errors:guards.targetable.userBanned')
      return false
    }
    ctx.targetedUser = ctx.author
  }

  return true
}

export const registered = async (ctx: Context) => {
  const u = await ctx.getUserData()
  if (!u) {
    ctx.reply('errors:guards.registered.userNotRegistered')
    return false
  }
  if (u.isBanned) {
    ctx.reply('errors:guards.registered.userBanned')
    return false
  }
  ctx.targetedUser = ctx.author

  return true
}

export const onlyDMs = (ctx: Context) => {
  if (ctx.message.platform === 'telegram' && ctx.channel.id === ctx.author.id) return true
  if (ctx.message.platform === 'discord' && ctx.channel.type === 'dm') return true
  ctx.reply('errors:guards.onlyDMs')
  return false
}

export const unknown = (ctx: Context) => {
  error('commandEngine.guards', `commands with the unknown protection level cannot be executed`)
  ctx.reply('errors:unknown')
  return false
}
