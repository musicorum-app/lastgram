export interface CommandBaseComponent {
    data?: string
}

export type CommandComponentBuilderReturnTypes = Record<string, any> | Record<string, any>[] | undefined

export type CommandComponentBuilderPlatforms = 'discord' | 'telegram'

export const mergeID = (id: string, data: string | undefined) => `${id}::${data}`
