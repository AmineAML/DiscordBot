import { CommandMessage, Command, Description } from '@typeit/discord'
import { botCommands } from '../utils/utils'

export abstract class HelpCommand {
    @Command("help")
    @Description("List of all commands")
    async commands(command: CommandMessage) {
        const bot = ['Language learning', 'relationships', 'dating']
        command.channel.send(`Welcome to the BruhBot's HQ!\n\nChatbots:\n    Philosophy channel: Want to chat? BruhBot can talk about ${bot.join(', ')}\n    Positivity channel: No hate chat! just smile, say something nice and be told the same\n\nCommands list:\n${await botCommands()}`)
    }
}