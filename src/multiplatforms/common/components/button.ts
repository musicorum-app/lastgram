import {
    CommandBaseComponent,
    CommandComponentBuilderPlatforms,
    CommandComponentBuilderReturnTypes,
    mergeID
} from './base.js'

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
    type?: CommandButtonComponentType
}

export const buildButtonForPlatform = (
    platform: CommandComponentBuilderPlatforms,
    button: CommandButtonComponent,
    id: string
): CommandComponentBuilderReturnTypes => {
    switch (platform) {
        case 'discord':
            let data: { custom_id?: string, url?: string } = {}
            if (button.url) data.url = button.url
            else data.custom_id = mergeID(id, button.data)

            return {
                label: button.name,
                emoji: button.emoji,
                type: 2,
                style: button.type ?? CommandButtonComponentType.primary,
                url: button.url,
                disabled: button.disabled,
                ...data
            }
        case 'telegram':
            if (button.disabled) return undefined

            let tgData: { callback_data?: string, url?: string } = {}
            if (button.url) tgData.url = button.url
            else tgData.callback_data = mergeID(id, button.data)

            return {
                text: button.emoji ? `${button.emoji} ${button.name}` : button.name,
                ...tgData
            }
    }
}
