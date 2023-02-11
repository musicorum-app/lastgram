import { Platform } from '../platform.js'
import { error, grey, info } from '../../loggingEngine/logging.js'
import { Context, MinimalContext } from '../common/context.js'
import { Replyable } from '../protocols.js'
import { ButtonInteraction, ChatInputCommandInteraction, Client, Interaction } from 'discord.js'
import { commandRunner } from '../../commandEngine/index.js'
import { buildFromDiscordUser } from '../common/user.js'
import { eventEngine } from '../../eventEngine/index.js'

export default class Discord extends Platform {
  private client: Client<boolean>

  constructor () {
    super('discord')
    if (!process.env.DISCORD_TOKEN) {
      error('discord.main', 'DISCORD_TOKEN environment variable not set. Discord will not be available.')
      return
    }

    this.client = new Client({ intents: ['Guilds'] })
    this.client.on('ready', () => this.onReady())
    this.client.on('interactionCreate', (...args) => this.onInteraction(...args))

    this.createCounter('discord_requests', 'Discord request count', ['success', 'method'])
  }

  onReady () {
    info('discord.onReady', `logged in as ${this.client.user!.tag}`)
    // set to dnd and listening to commands
    this.client.user!.setPresence({
      activities: [{
        name: 't.me/lastgramrobot',
        type: 2
      }],
      status: 'dnd'
    })
  }

  async onInteraction (interaction: Interaction) {
    if (interaction.isChatInputCommand()) return this.onChatInputCommand(interaction)
    if (interaction.isButton()) return this.onButtonInteraction(interaction)
  }

  async onButtonInteraction (interaction: ButtonInteraction) {
    info('discord.onInteraction', `received button interaction`)
    const minimalCtx = new MinimalContext(interaction.channelId, buildFromDiscordUser(interaction.user), interaction.customId)
    try {
      await eventEngine.dispatchEvent({
        userID: interaction.user.id,
        channelID: interaction.channelId,
        platform: 'discord'
      }, 'buttonClick', minimalCtx)

      if (minimalCtx.replyWith) await this.deliverMessage(minimalCtx, minimalCtx.replyWith, interaction)
    } catch (e) {
      error('discord.onButtonInteraction', `error while handling button interaction\n${grey(e.stack)}`)
    }
  }

  async onChatInputCommand (interaction: ChatInputCommandInteraction) {
    info('discord.onInteraction', `received interaction ${interaction.commandName}`)
    const cmd = commandRunner.hasCommand(interaction.commandName)
    if (!cmd) return

    const ctx = Context.fromDiscordMessage(
      interaction,
      interaction.options.data
        .map(o => o.value?.toString?.())
        .filter(a => a) as string[],
      commandRunner
    )

    await interaction.deferReply()

    await commandRunner.runCommand(interaction.commandName, ctx)
    if (ctx.replyWith) await this.deliverMessage(ctx, ctx.replyWith, interaction)
  }

  deliverMessage (ctx: MinimalContext, text: Replyable, interaction: ChatInputCommandInteraction | ButtonInteraction) {
    if (interaction.isButton()) {
      interaction.editReply = interaction.update
    }
    if (ctx.replyOptions?.imageURL) {
      return interaction.editReply({
        content: text.toString(),
        files: [ctx.replyOptions.imageURL]
      })
    } else {
      return interaction.editReply({
        content: text.toString(),
        // @ts-ignore
        components: ctx.components.components,
        ephemeral: ctx.replyOptions?.ephemeral ?? false
      })
    }
  }

  async start () {
    await this.client.login(process.env.DISCORD_TOKEN)
  }
}
