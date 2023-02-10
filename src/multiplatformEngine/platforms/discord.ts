import { Platform } from '../platform.js'
import { error, info } from '../../loggingEngine/logging.js'
import { Context } from '../common/context.js'
import { Replyable } from '../protocols.js'
import { ChatInputCommandInteraction, Client, Interaction } from 'discord.js'
import { commandRunner } from '../../commandEngine/index.js'

export default class Discord extends Platform {
  private client: Client<boolean>

  constructor () {
    super('discord')
    if (!process.env.DISCORD_TOKEN) {
      error('discord.main', 'DISCORD environment variable not set')
      process.exit(1)
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
    if (!interaction.isChatInputCommand()) return
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

  deliverMessage (ctx: Context, text: Replyable, interaction: ChatInputCommandInteraction) {
    if (ctx.replyOptions?.imageURL) {
      return interaction.editReply({
        content: text.toString(),
        files: [ctx.replyOptions.imageURL]
      })
    } else {
      return interaction.editReply(text.toString())
    }
  }

  async start () {
    await this.client.login(process.env.DISCORD_TOKEN)
  }
}
