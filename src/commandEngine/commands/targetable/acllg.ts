import { Context, MinimalContext } from '../../../multiplatformEngine/common/context.js'
import { ClassicCollageData, generateAsymmetricCollage } from '../../../internalEngine/ditto.js'
import { inferDataFromContent, ModifiedClassicCollageData } from '../../helpers.js'
import { backend } from '../../../cachingEngine/index.js'
import { ExpiredError } from '../../../eventEngine/types/errors.js'
import { CommandButtonComponentType } from '../../../multiplatformEngine/common/components/button.js'
import { debug } from '../../../loggingEngine/logging.js'

const generateAndSaveData = async (ctx: MinimalContext, names: { displayName: string; username: string }, data: ClassicCollageData) => {
  const imageURL = await generateAsymmetricCollage(ctx, names.username, data)
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
  ctx.reply(`${displayName}, ${data.entity}, ${data.period}`, {}, {
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
    case 'labels':
      data.show_labels = !data.show_labels
      break
  }

  await backend!.quickEdit(id, JSON.stringify(data))

  const imageURL = await generateAndSaveData(ctx, { username: data.username, displayName: data.displayName }, data)
  ctx.reply(`${data.displayName}, ${data.entity}, ${data.period}`, {}, {
    imageURL,
    sendImageAsPhoto: true,
    noTranslation: true
  })
}

const buildComponents = (ctx: MinimalContext, data: ClassicCollageData, id: string) => {
  ctx.components.newGroup((b) => {
    b.addButton({
      emoji: data.show_labels ? '✅' : '❌',
      name: 'commands:cllg.buttons.showLabels',
      type: CommandButtonComponentType.primary,
      data: id + '_labels'
    }, 'refreshCollage')
  })
}

export const info = {
  aliases: []
}
