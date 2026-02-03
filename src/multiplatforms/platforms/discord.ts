import { Platform } from '../platform.js'
import { debug, error, grey, info } from '../../logging/logging.js'
import { Context, MinimalContext } from '../common/context.js'
import { Replyable } from '../protocols.js'
import { ButtonInteraction, ChatInputCommandInteraction, Client, Interaction } from 'discord.js'
import { commandRunner } from '../../commands/index.js'
import { buildFromDiscordUser } from '../common/user.js'
import { eventEngine } from '../../event/index.js'
import { EngineError } from '../../event/types/errors.js'
import { updateDiscordCommands } from '../utilities/discord.js'

export default class Discord extends Platform {
    private client: Client

    constructor() {
        super('discord')
        if (!process.env.DISCORD_TOKEN) {
            error('discord.main', 'DISCORD_TOKEN environment variable not set. Discord will not be available.')
            return
        }

        this.client = new Client({ intents: ['Guilds'] })
        this.client.on('clientReady', () => this.onReady())
        this.client.on('interactionCreate', (...args) => this.onInteraction(...args))

        this.createCounter('discord_requests', 'Discord request count', ['success', 'method'])
        if (process.env.DISCORD_UPDATE_COMMANDS_ON_START) updateDiscordCommands().then(() => info('discord.main', 'commands updated'))
    }

    onReady() {
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

    async onInteraction(interaction: Interaction) {
        if (interaction.isChatInputCommand()) return this.onChatInputCommand(interaction)
        if (interaction.isButton()) return this.onButtonInteraction(interaction)
    }

    async onButtonInteraction(interaction: ButtonInteraction) {
        debug('discord.onInteraction', `received button interaction`)
        const [id, data] = eventEngine.extractIDFromData(interaction.customId)
        const minimalCtx = new MinimalContext(buildFromDiscordUser(interaction.user), data)
        await minimalCtx.getUserData(undefined, 'registeredUserData')
        try {
            await eventEngine.dispatchEvent(id, minimalCtx)
            if (minimalCtx.replyWith) await this.deliverMessage(minimalCtx, minimalCtx.replyWith, interaction)
        } catch (e) {
            if (e instanceof EngineError) {
                await interaction.reply({ content: minimalCtx.t(e.translationKey), ephemeral: true })
                return
            }
            error('discord.onButtonInteraction', `error while handling button interaction\n${grey(e.stack)}`)
        }
    }

    async onChatInputCommand(interaction: ChatInputCommandInteraction) {
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
        ctx.setCommand({ name: interaction.commandName, protectionLevel: 'unknown' })

        await interaction.deferReply()

        await commandRunner.runCommand(interaction.commandName, ctx)
        if (ctx.replyWith) await this.deliverMessage(ctx, ctx.replyWith, interaction)
    }

    deliverMessage(ctx: MinimalContext, text: Replyable, interaction: ChatInputCommandInteraction | ButtonInteraction) {
        if (interaction.isButton()) {
            if (ctx.replyOptions?.editOriginal === false) {
                // use follow-up
                return interaction.followUp({
                    content: text.toString(),
                    ephemeral: ctx.replyOptions?.ephemeral ?? false,
                    files: ctx.replyOptions?.imageURL ? [ctx.replyOptions.imageURL] : undefined,
                    // @ts-ignore
                    components: ctx.replyOptions?.keepComponents ? undefined : ctx.components.components,
                })
            } else {
                // use update
                return interaction.update({
                    content: text.toString(),
                    // @ts-ignore
                    components: ctx.replyOptions?.keepComponents ? undefined : ctx.components.components,
                    files: ctx.replyOptions?.imageURL ? [ctx.replyOptions.imageURL] : undefined
                })
            }
        }

        if (ctx.replyOptions?.imageURL) {
            return interaction.editReply({
                content: text.toString(),
                files: [ctx.replyOptions.imageURL],
                // @ts-ignore
                components: ctx.replyOptions?.keepComponents ? undefined : ctx.components.components,
                ephemeral: ctx.replyOptions?.ephemeral ?? false
            })
        } else {
            return interaction.editReply({
                content: text.toString(),
                // @ts-ignore
                components: ctx.replyOptions?.keepComponents ? undefined : ctx.components.components,
                ephemeral: ctx.replyOptions?.ephemeral ?? false
            })
        }
    }

    async start() {
        if (!process.env.DISCORD_TOKEN) return
        await this.client.login(process.env.DISCORD_TOKEN)
    }
}
