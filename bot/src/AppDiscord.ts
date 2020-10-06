//Use the Client that are provided by @typeit/discord
import { Discord, CommandMessage, CommandNotFound } from "@typeit/discord";
import * as Path from 'path'

@Discord("!", {
    import: [
        Path.join(__dirname, "commands", "*.ts"),
        Path.join(__dirname, "events", "*.ts")
    ]
})
abstract class AppDiscord {
    @CommandNotFound()
    async notFound(command: CommandMessage) {
        command.reply("Command not found, try !help")
    }
}