import { Context } from '../multiplatformEngine/common/context.js'

export const all = () => true

export const registered = async (ctx: Context) => {
  if (ctx.message.replyingToUser) {
    const u = await ctx.getUserData(ctx.message.replyingToUser)
    if (!u) {
      ctx.reply('The user you mentioned has not registered themselves yet. Use `/reg <last.fm username>` to register.')
      return false
    }
  } else {
    const u = await ctx.getUserData()
    if (!u) {
      ctx.reply('This command is only available to registered users. Use `/reg <last.fm username>` to register.')
      return false
    }
  }

  return true
}

export const runExecutionGuard = async (guard: string, ctx: Context) => {
  switch (guard) {
    case 'all':
      return all()
    case 'registered':
      return registered(ctx)
    default:
      return true
  }
}