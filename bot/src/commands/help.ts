import { CommandMessage, Command, Description, Infos } from '@typeit/discord'
import { MessageEmbed } from 'discord.js'
import { artCommands, channelsCommands, generalCommands, quotesCommands } from '../utils/utils'

export abstract class HelpCommand {
    @Command("help")
    @Infos({ type: "general" })
    @Description("List of all commands")
    async commands(command: CommandMessage) {
        command.channel.startTyping()

        const bot = ['social skills', 'relationships', 'self improvement']

        command.channel.send('**BruhBot** Commands:')
        
        const discordBotCommands = new MessageEmbed()
        .setColor('#0099ff')
        .addField('Chat', `Philosophy channel: Want to chat? BruhBot can talk about ${bot.join(', ')}\nPositivity channel: No hate chat! just smile, say something nice and be told the same` )
        .addField('General Commands', `${await generalCommands()}`)
        .addField('Channels Commands', `${await channelsCommands()}`)
        .addField('Quotes Commands', `${await quotesCommands()}`)
        .addField('Art Commands', `${await artCommands()}`)

        command.channel.send(discordBotCommands)

        command.channel.stopTyping()
    }
}