import { CommandBaseComponent, CommandComponentBuilderPlatforms, CommandComponentBuilderReturnTypes } from './base.js'

export enum CommandButtonComponentType {
  primary = 1,
  secondary,
  success,
  danger,
  link
}

export interface CommandButtonComponent extends CommandBaseComponent {
  name: string
  emoji?: string
  url?: string
  disabled?: boolean
  data: string
  type?: CommandButtonComponentType
}

export const buildButtonForPlatform = (
  platform: CommandComponentBuilderPlatforms,
  button: CommandButtonComponent
): CommandComponentBuilderReturnTypes => {
  switch (platform) {
    case 'discord':
      return {
        label: button.name,
        emoji: button.emoji,
        type: 2,
        style: button.type ?? CommandButtonComponentType.primary,
        custom_id: button.data,
        url: button.url,
        disabled: button.disabled
      }
    case 'telegram':
      if (button.disabled) return undefined
      return {
        text: button.emoji ? `${button.emoji} ${button.name}` : button.name,
        url: button.url,
        callback_data: button.data
      }
  }
}
