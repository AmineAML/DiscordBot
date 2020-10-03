import { Description, On, ArgsOf, Client } from '@typeit/discord'
import { TextChannel } from 'discord.js';
import { getBotMessage } from '../services/command-service';

export abstract class RedditDiscordCommands {
    @On("message")
    @Description("A philosophical tea hangout")
    private async onMessage (
        [message]: ArgsOf<"message">,
        client: Client
    ) {
        //Don't answer a message sent by the bot
        if (message.author.bot) return;

        //Don't answer any message without a prefix on any other channel than the channel named philosophy
        const cnl = message.guild!.channels.cache.get(message.channel.id)

        if (cnl!.name !== 'philosophy') return;

        const channel = message.guild!.channels.cache.find(ch => ch.name === 'philosophy') as TextChannel

        channel.startTyping()

        const userMessageContent = message.content.toLowerCase()

        //Based on the sentiment analyser to know it the message is negative use an advice subreddit, else use a not advice specific subreddit
        if (userMessageContent.includes('language')) {
            const botUserMessage = await getBotMessage('languagelearning', userMessageContent)

            channel.send(botUserMessage)
        } else if (userMessageContent.includes('dating') && userMessageContent.includes('advice'))  {
            const botUserMessage = await getBotMessage('dating_advice', userMessageContent)

            channel.send(botUserMessage)
        } else if (userMessageContent.includes('relationship') && userMessageContent.includes('advice')) {
            const botUserMessage = await getBotMessage('relationship_advice', userMessageContent)

            channel.send(botUserMessage)
        } else if (userMessageContent.includes('dating')) {
            const botUserMessage = await getBotMessage('dating', userMessageContent)

            channel.send(botUserMessage)
        } else if (userMessageContent.includes('relationship')) {
            const botUserMessage = await getBotMessage('relationships', userMessageContent)

            channel.send(botUserMessage)
        }
        
        else {
            channel.send(message.content)
        }

        channel.stopTyping()
    }
}