import { CommandComponentBuilderPlatforms, CommandComponentBuilderReturnTypes } from './base.js'
import { CommandButtonComponent } from './button.js'
import { buildComponentForPlatform } from './list.js'
import { MinimalContext } from '../context.js'
import { eventEngine } from '../../../eventEngine/index.js'

export interface ComponentOptions {
  noTranslate?: boolean
}

export class CommandComponentBuilder {
  public components: CommandComponentBuilderReturnTypes[]
  public platform: CommandComponentBuilderPlatforms

  constructor (public context: MinimalContext, public isGroup = false) {
    this.components = []
    this.platform = context.author.platform as CommandComponentBuilderPlatforms
  }

  addButton (button: CommandButtonComponent, handlerFunction?: string, options?: ComponentOptions) {
    const id = this.randomID()
    const component = buildComponentForPlatform(this.platform, 'button', {
      ...button,
      data: button.data,
      name: options?.noTranslate ? button.name : this.context.t(button.name)
    }, id)

    const group = buildComponentForPlatform(this.platform, 'group', {
      components: [component]
    })

    component && this.components.push(this.isGroup ? component : group)
    handlerFunction && this.queueEvent(id, handlerFunction)
    return this
  }

  newGroup (builder: (builder: CommandComponentBuilder) => any) {
    const b = new CommandComponentBuilder(this.context, true)
    builder(b)
    const groupComponent = buildComponentForPlatform(this.platform, 'group', {
      components: b.components
    })
    this.components.push(groupComponent)
    return this
  }

  private queueEvent (identifier: string, handler: string) {
    eventEngine.queueEvent(
      identifier,
      {
        command: this.context.command!.name,
        handler
      }
    )
  }

  private randomID () {
    // 10-character random string, all lowercase and no special characters
    return Math.random().toString(36).substring(2, 12)
  }
}
