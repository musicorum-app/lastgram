import { CommandBaseComponent, CommandComponentBuilderPlatforms, CommandComponentBuilderReturnTypes } from './base.js'

export interface CommandComponentGroup extends CommandBaseComponent {
  components: CommandComponentBuilderReturnTypes[]
}

export const buildGroupForPlatform = (
  platform: CommandComponentBuilderPlatforms,
  group: CommandComponentGroup
): CommandComponentBuilderReturnTypes => {
  switch (platform) {
    case 'discord':
      return {
        type: 1,
        components: group.components
      }
    case 'telegram':
      return group.components
  }
}
