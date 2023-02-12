import { Context, MinimalContext } from '../../../multiplatformEngine/common/context.js'
import { finishAuth, prepareForAuth } from '../../../fmEngine/connect.js'
import { CommandButtonComponentType } from '../../../multiplatformEngine/common/components/button.js'
import { updateUserByID } from '../../../database.js'

export default async (ctx: Context) => {
  const linkURL = await prepareForAuth(ctx.userData.id)

  ctx.components.addButton({
    name: 'commands:linkfm.buttons.link',
    emoji: '🔗',
    url: linkURL,
    type: CommandButtonComponentType.link
  })

  ctx.components.newGroup((builder) => {
    builder.addButton({
      name: 'commands:linkfm.buttons.done',
      emoji: '✅',
      type: CommandButtonComponentType.success
    }, 'doneLinking')

    builder.addButton({
      name: 'commands:linkfm.buttons.cancel',
      emoji: '❌',
      type: CommandButtonComponentType.danger
    }, 'cancelLinking')
  })

  ctx.reply('commands:linkfm.link')
}

export const cancelLinking = async (ctx: MinimalContext) => {
  ctx.reply('commands:linkfm.cancelled')
}

export const doneLinking = async (ctx: MinimalContext) => {
  const data = await finishAuth(ctx.userData.id)
  if (!data) {
    ctx.reply('commands:linkfm.linkingError')
    return
  }

  if (data.username.toLowerCase() !== ctx.userData.fmUsername.toLowerCase()) {
    updateUserByID(ctx.userData.id, {
      fmUsername: data.username
    })
    ctx.reply('commands:linkfm.successWithUsername', {
      username: data.username
    })
    return
  }

  ctx.reply('commands:linkfm.success', { username: data.username })
}
export const info = {
  aliases: ['linklast']
}
