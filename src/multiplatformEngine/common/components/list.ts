import { buildButtonForPlatform, CommandButtonComponent } from './button.js'
import { CommandComponentBuilderPlatforms } from './base.js'
import { buildGroupForPlatform, CommandComponentGroup } from './group.js'

export type CommandComponentList = {
  'button': CommandButtonComponent
  'group': CommandComponentGroup
}

export type CommandComponent = keyof CommandComponentList

export const buildComponentForPlatform = (
  platform: CommandComponentBuilderPlatforms,
  component: CommandComponent,
  data: CommandComponentList[CommandComponent]
) => {
  switch (component) {
    case 'button':
      return buildButtonForPlatform(platform, data as CommandButtonComponent)
    case 'group':
      return buildGroupForPlatform(platform, data as CommandComponentGroup)
    default:
      return undefined
  }
}
