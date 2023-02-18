import { Context, MinimalContext } from '../../../multiplatformEngine/common/context.js'
import { ClassicCollageData, generateClassicCollage } from '../../../internalEngine/ditto.js'
import { debug } from '../../../loggingEngine/logging.js'
import { inferDataFromContent, ModifiedClassicCollageData } from '../../helpers.js'
import { CommandButtonComponentType } from '../../../multiplatformEngine/common/components/button.js'
import { backend } from '../../../cachingEngine/index.js'
import { ExpiredError } from '../../../eventEngine/types/errors.js'

const generateAndSaveData = async (ctx: MinimalContext, names: { displayName: string; username: string }, data: ClassicCollageData) => {
  const imageURL = await generateClassicCollage(ctx, names.username, data)
  debug('commandEngine.collage', `collage generated: ${imageURL}`)

  const id = await backend!.quickSave(JSON.stringify({ ...data, ...names }))
  buildComponents(ctx, data, id)
  return imageURL
}

export default async (ctx: Context) => {
  const data = inferDataFromContent(ctx.message.content)
  const username = ctx.targetedUserData?.fmUsername ?? ctx.registeredUserData!.fmUsername
  const displayName = ctx.targetedUser?.name ?? ctx.registeredUser!.name

  const imageURL = await generateAndSaveData(ctx, { username, displayName }, data)
  ctx.reply(`${displayName}, ${data.rows}x${data.columns}, ${data.entity}, ${data.period}`, {}, {
    imageURL,
    sendImageAsPhoto: true,
    noTranslation: true
  })
}

export const refreshCollage = async (ctx: MinimalContext) => {
  const [id, action] = ctx.interactionData!.split('_')
  const cllgData = await backend!.get(id)
  if (!cllgData) throw new ExpiredError()
  const data = JSON.parse(cllgData) as ModifiedClassicCollageData

  switch (action) {
    case 'increase':
      data.rows++
      data.columns++
      break
    case 'decrease':
      data.rows--
      data.columns--
      break
    case 'labels':
      data.show_labels = !data.show_labels
      break
    case 'padded':
      data.padded = !data.padded
      break
  }

  await backend!.quickEdit(id, JSON.stringify(data))

  const imageURL = await generateAndSaveData(ctx, { username: data.username, displayName: data.displayName }, data)
  ctx.reply(`${data.displayName}, ${data.rows}x${data.columns}, ${data.entity}, ${data.period}`, {}, {
    imageURL,
    sendImageAsPhoto: true,
    noTranslation: true
  })
}

const buildComponents = (ctx: MinimalContext, data: ClassicCollageData, id: string) => {
  ctx.components.newGroup((b) => {
    // + emoji
    b.addButton({
      emoji: '➕',
      name: 'commands:cllg.buttons.increase',
      type: CommandButtonComponentType.primary,
      data: id + '_increase'
    }, 'refreshCollage')

    // - emoji
    b.addButton({
      emoji: '➖',
      name: 'commands:cllg.buttons.decrease',
      type: CommandButtonComponentType.primary,
      data: id + '_decrease'
    }, 'refreshCollage')
  })

  ctx.components.newGroup((b) => {
    b.addButton({
      emoji: data.show_labels ? '✅' : '❌',
      name: 'commands:cllg.buttons.showLabels',
      type: CommandButtonComponentType.primary,
      data: id + '_labels'
    }, 'refreshCollage')

    b.addButton({
      emoji: data.padded ? '✅' : '❌',
      name: 'commands:cllg.buttons.padded',
      type: CommandButtonComponentType.primary,
      data: id + '_padded'
    }, 'refreshCollage')
  })
}

export const info = {
  aliases: []
}
