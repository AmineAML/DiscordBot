//Use the Client that are provided by @typeit/discord
import { Discord, CommandMessage, CommandNotFound } from "@typeit/discord";
import * as Path from 'path'

@Discord("!", {
    import: [
        Path.join(__dirname, "commands", "*.ts"),
        Path.join(__dirname, "events", "*.ts"),
        
        // If you compile your bot, the file extension will be .js
        Path.join(__dirname, "commands", "*.js"),
        Path.join(__dirname, "events", "*.js")
    ]
})
abstract class AppDiscord {
    @CommandNotFound()
    async notFound(command: CommandMessage) {
        command.channel.send("Command not found, try !help")
    }
}