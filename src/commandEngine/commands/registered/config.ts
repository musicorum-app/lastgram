import { Context, MinimalContext } from '../../../multiplatformEngine/common/context.js'
import { CommandButtonComponentType } from '../../../multiplatformEngine/common/components/button.js'
import { updateUserByID } from '../../../databaseEngine/index.js'
import { lt } from '../../../translationEngine/index.js'

export default async (ctx: Context) => {
  ctx.components.addButton({
    name: 'commands:config.buttons.changeLanguage',
    emoji: '🌎',
    type: CommandButtonComponentType.primary
  }, 'changeLanguage')

  ctx.components.addButton({
    name: 'commands:config.buttons.donate',
    emoji: '💸',
    type: CommandButtonComponentType.primary
  }, 'donate')

  ctx.components.addButton({
    name: 'commands:config.buttons.lnExhibition',
    emoji: '🎼',
    type: CommandButtonComponentType.primary
  }, 'lnConfig')

  ctx.reply('core:dialogues.pickAnOption')
}

export const lnConfig = async (ctx: MinimalContext) => {
  ctx.components.newGroup((builder) => {
    builder.addButton({
      name: 'commands:config.buttons.ln.showTags',
      emoji: '🏷️',
      type: CommandButtonComponentType.primary
    }, 'showTags')

    builder.addButton({
      name: 'commands:config.buttons.ln.hideTags',
      emoji: '🚫',
      type: CommandButtonComponentType.primary
    }, 'noTags')
  })

  ctx.components.newGroup((builder) => {
    builder.addButton({
      name: 'commands:config.buttons.ln.sendPhotoAsLink',
      emoji: '🖼️',
      type: CommandButtonComponentType.primary
    }, 'togglePhotoToLink')

    builder.addButton({
      name: 'commands:config.buttons.ln.sendPhotoAsPhoto',
      emoji: '📷',
      type: CommandButtonComponentType.primary
    }, 'togglePhotoToPhoto')
  })

  ctx.components.addButton({
    name: 'core:buttons.cancel',
    emoji: '❌',
    type: CommandButtonComponentType.danger
  }, 'cancelOperation')

  ctx.reply('commands:config.lnConfig')
}

export const showTags = async (ctx: MinimalContext) => {
  await updateUserByID(ctx.registeredUserData.id, {
    sendTags: true
  })

  ctx.reply('commands:config.lnConfigUpdated')
}

export const noTags = async (ctx: MinimalContext) => {
  await updateUserByID(ctx.registeredUserData.id, {
    sendTags: false
  })

  ctx.reply('commands:config.lnConfigUpdated')
}

export const togglePhotoToLink = async (ctx: MinimalContext) => {
  await updateUserByID(ctx.registeredUserData.id, {
    sendPhotosAsLink: true
  })

  ctx.reply('commands:config.lnConfigUpdated')
}

export const togglePhotoToPhoto = async (ctx: MinimalContext) => {
  await updateUserByID(ctx.registeredUserData.id, {
    sendPhotosAsLink: false
  })

  ctx.reply('commands:config.lnConfigUpdated')
}

export const changeLanguage = async (ctx: MinimalContext) => {
  ctx.components.newGroup((builder) => {
    builder.addButton({
      name: 'core:languages.english',
      emoji: '🇺🇸',
      type: CommandButtonComponentType.primary,
      data: 'en'
    }, 'switchLanguage')

    builder.addButton({
      name: 'core:languages.spanish',
      emoji: '🇪🇸',
      type: CommandButtonComponentType.primary,
      data: 'es'
    }, 'switchLanguage')
  })

  ctx.components.newGroup((builder) => {
    builder.addButton({
      name: 'core:languages.portuguese',
      emoji: '🇧🇷',
      type: CommandButtonComponentType.primary,
      data: 'pt'
    }, 'switchLanguage')

    builder.addButton({
      name: 'core:languages.russian',
      emoji: '🇷🇺',
      type: CommandButtonComponentType.primary,
      data: 'ru'
    }, 'switchLanguage')
  })

  ctx.components.newGroup((builder) => {
    // french
    builder.addButton({
      name: 'core:languages.french',
      emoji: '🇫🇷',
      type: CommandButtonComponentType.primary,
      data: 'fr'
    }, 'switchLanguage')
  })

  ctx.components.addButton({
    name: 'core:buttons.cancel',
    emoji: '❌',
    type: CommandButtonComponentType.danger
  }, 'cancelOperation')

  ctx.reply('commands:config.pickALanguage')
}

export const switchLanguage = async (ctx: MinimalContext) => {
  await updateUserByID(ctx.registeredUserData.id, {
    language: ctx.interactionData
  })

  ctx.reply(lt(ctx.interactionData!, 'core:dialogues.switchedLanguages', {}), {}, { noTranslation: true })
}

export const donate = async (ctx: MinimalContext) => {
  ctx.components.addButton({
    name: 'commands:config.buttons.patreon',
    url: 'https://www.patreon.com/musicorumapp',
    emoji: '💰',
    type: CommandButtonComponentType.link
  })

  ctx.reply('commands:config.donate')
}

export const cancelOperation = async (ctx: MinimalContext) => {
  ctx.reply('core:dialogues.cancelled')
}

export const info = {
  aliases: ['settings']
}
