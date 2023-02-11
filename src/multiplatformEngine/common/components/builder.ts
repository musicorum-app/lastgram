import { CommandComponentBuilderPlatforms } from './base.js'
import { CommandButtonComponent } from './button.js'
import { buildComponentForPlatform } from './list.js'
import { MinimalContext } from '../context.js'
import { eventEngine } from '../../../eventEngine/index.js'
import { EventConstraints } from '../../../eventEngine/types/engine.js'

export class CommandComponentBuilder {
  public components: Record<string, any>[]
  public platform: CommandComponentBuilderPlatforms

  constructor (public context: MinimalContext) {
    this.components = []
    this.platform = context.author.platform as CommandComponentBuilderPlatforms
  }

  addButton (button: CommandButtonComponent, handler?: (ctx: MinimalContext) => boolean) {
    const id = this.randomID()
    const component = buildComponentForPlatform(this.platform, 'button', {
      ...button,
      data: `${id}_${button.data}`
    })
    component && this.components.push({ type: 1, components: [component] })
    handler && eventEngine.queueEvent(
      this.buildConstraint(),
      'buttonClick',
      (ctx) => {
        if (ctx.interactionData!.split('_')[0] !== id) return false
        ctx.interactionData = ctx.interactionData!.split('_')[1]
        return handler(ctx)
      }
    )
    return this
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
