

const regex = /^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/u

const discordTypeMapping = {
  subCommand: 1,
  subCommandGroup: 2,
  string: 3,
  integer: 4,
  boolean: 5
}

interface DiscordCommandOption {
  name: string
  description: string
  type: number
  required?: boolean
}

const commandArgToDiscordOption = (arg: CommandArgs, command: Command): DiscordCommandOption => {
  return {
    name: arg.name,
    description: 'The ' + lt('en', `args:${command.name}.${arg.name}`, {}),
    type: discordTypeMapping[arg.type ?? 'string'],
    required: arg.required
  }
}

export const generateDiscordCommandList = () => {
  return loadedCommands
      .filter(z => !z.hidden && !z.disabledPlatforms?.includes('discord')).map((command, i) => {
    // check if name matches regex
    if (!regex.test(command.name)) {
      error('discord.generateDiscordCommandList', `Command name "${command.name}" does not match regex.`)
      throw new Error('Command name does not match regex.')
    }

    console.log(i, command.name)

    return {
      name: command.name,
      description: lt('en', `descriptions:${command.name}`, {}),
      options: command.args?.map?.((arg) => commandArgToDiscordOption(arg, command)) ?? []
    }
  })
}

export const updateDiscordCommands = async (globalUpdate = true) => {
  const commands = generateDiscordCommandList()

    console.log(commands)

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!)
  try {
    globalUpdate
      ? await rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!),
        { body: commands }
      )
      : await rest.put(
        Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID!, process.env.DISCORD_GUILD_ID!),
        { body: commands }
      )
    info('discord.updateDiscordCommands', 'Successfully registered application commands.')
  } catch (err) {
    error('discord.updateDiscordCommands', `Failed to register application commands. Stack:\n${grey(err.stack)}`)
  }
}
