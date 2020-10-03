import { Description, On, ArgsOf, Client } from '@typeit/discord'
import { TextChannel } from 'discord.js';

export abstract class RedditDiscordCommands {
    @On("message")
    @Description("NEIN! just smile and say something nice and be told the same")
    private async onMessage (
        [message]: ArgsOf<"message">,
        client: Client
    ) {
        //Don't answer a message sent by the bot
        if (message.author.bot) return;

        //Don't answer any message without a prefix on any other channel than the channel named philosophy
        const cnl = message.guild!.channels.cache.get(message.channel.id)

        if (cnl!.name !== 'positivity') return;

        const channel = message.guild!.channels.cache.find(ch => ch.name === 'positivity') as TextChannel

        const userMessageContent = message.content.toLowerCase()

        const { Language } = require('node-nlp')

        const langauge = new Language()
        const guess = langauge.guess(userMessageContent)

        const { SentimentManager } = require('node-nlp');

        const sentiment = new SentimentManager()

        if (guess[0].language == 'English') {
            const vote = await sentiment.process(guess[0].alpha2, userMessageContent).vote

            if (vote == "positive") {
                message.react('👍')
            } else {
                message.react('👎')
            }
        }

        if (guess[0].language == 'French') {
            const vote = await sentiment.process(guess[0].alpha2, userMessageContent).vote

            if (vote == "positive") {
                message.react('👍')
            } else {
                message.react('👎')
            }
        }
    }
}