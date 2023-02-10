import { Context } from '../multiplatformEngine/common/context.js'

export const all = () => true

export const targetable = async (ctx: Context) => {
  if (ctx.message.replyingToUser) {
    const u = await ctx.getUserData(ctx.message.replyingToUser)
    if (!u) {
      // ctx.reply('The user you mentioned has not registered themselves yet. Use `/register <last.fm username>` to register.')
      ctx.reply('errors:guards.targetable.userMentionedNotRegistered')
      return false
    }
    if (u.isBanned) {
      // ctx.reply('Sorry, the user you mentioned has been banned from using this bot. Consult with @lastgramsupport for more information.')
      ctx.reply('errors:guards.targetable.userMentionedBanned')
      return false
    }
    ctx.targetedUser = ctx.message.replyingToUser
  } else {
    const u = await ctx.getUserData()
    if (!u) {
      // ctx.reply('This command is only available to registered users. Use `/register <last.fm username>` to register.')
      ctx.reply('errors:guards.targetable.userNotRegistered')
      return false
    }
    if (u.isBanned) {
      // ctx.reply('Sorry, you have been banned from using this bot. Consult with @lastgramsupport for more information.')
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
    // ctx.reply('This command is only available to registered users. Use `/register <last.fm username>` to register.')
    ctx.reply('errors:guards.registered.userNotRegistered')
    return false
  }
  if (u.isBanned) {
    // ctx.reply('Sorry, you have been banned from using this bot. Consult with @lastgramsupport for more information.')
    ctx.reply('errors:guards.registered.userBanned')
    return false
  }
  ctx.targetedUser = ctx.author

  return true
}
