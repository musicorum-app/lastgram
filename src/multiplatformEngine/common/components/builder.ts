import { CommandComponentBuilderPlatforms, CommandComponentBuilderReturnTypes } from './base.js'
import { CommandButtonComponent } from './button.js'
import { buildComponentForPlatform } from './list.js'
import { MinimalContext } from '../context.js'
import { eventEngine } from '../../../eventEngine/index.js'
import { EngineEventList, EventConstraints } from '../../../eventEngine/types/engine.js'

export interface ComponentOptions {
  noTranslate?: boolean
}

export class CommandComponentBuilder {
  public components: CommandComponentBuilderReturnTypes[]
  public platform: CommandComponentBuilderPlatforms

  constructor (public context: MinimalContext) {
    this.components = []
    this.platform = context.author.platform as CommandComponentBuilderPlatforms
  }

  addButton (button: CommandButtonComponent, handler?: (ctx: MinimalContext) => boolean, options?: ComponentOptions) {
    const id = this.randomID()
    const component = buildComponentForPlatform(this.platform, 'button', {
      ...button,
      data: `${id}_${button.data}`,
      name: options?.noTranslate ? button.name : this.context.t(button.name)
    })
    const group = buildComponentForPlatform(this.platform, 'group', {
      components: [component]
    })
    component && this.components.push(group)
    handler && this.queueEvent(id, 'buttonClick', handler)
    return this
  }

  private queueEvent (id: string, event: keyof EngineEventList, handler: (ctx: MinimalContext) => boolean) {
    eventEngine.queueEvent(
      this.buildConstraint(),
      event,
      (ctx) => {
        if (ctx.interactionData!.split('_')[0] !== id) return false
        ctx.interactionData = ctx.interactionData!.split('_')[1]
        return handler(ctx)
      }
    )
  }

  private randomID () {
    // 5 digits
    return Math.floor(Math.random() * 100000).toString()
  }

  private buildConstraint (): EventConstraints {
    return {
      userID: this.context.author.id,
      channelID: this.context.channelID,
      platform: this.platform
    }
  }
}
