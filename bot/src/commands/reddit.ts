import { CommandMessage, Command, Description } from '@typeit/discord'
import { RedditPosts } from '../models'
import { reddit } from '../services/command-service'
import * as RedditService from '../services/reddit-service'

export abstract class TwitchDiscordCommands {
    @Command("pro")
    @Description("Useful pro advices")
    async pro(command: CommandMessage) {
        command.channel.startTyping()

        const proAdvice: RedditPosts.Posts = await RedditService.getPosts('lifeprotips')

        const { children } = proAdvice.data

        const pro = children[Math.floor(Math.random() * children.length)]

        command.channel.send(pro.data.title.replace('LPT:' || 'LPT' || 'lpt', '') + '\n' + pro.data.selftext)

        command.channel.stopTyping()
    }

    @Command("stoic")
    @Description("Useful quotes of stoicism")
    async stoic(command: CommandMessage) {
        command.channel.startTyping()

        const stoicism: RedditPosts.Posts = await RedditService.getPosts('stoicism')

        const { children } = stoicism.data

        const resultsS = await Promise.allSettled(children.map(element => {
            const { link_flair_text, selftext } = element.data
    
            //Some posts doesn't include any flairs
            if (link_flair_text != null) {
                if (link_flair_text.toLowerCase().includes('quote')) {
                    return selftext
                }
            }
        }))
        
        const selftexts = reddit(resultsS)

        const stoic = selftexts[Math.floor(Math.random() * selftexts.length)]

        command.channel.send(stoic)

        command.channel.stopTyping()
    }

    @Command("hera")
    @Description("Pictures of heraldry, coat of arms, blazonry and the like")
    async heraldry(command: CommandMessage) {
        command.channel.startTyping()

        const heraldry: RedditPosts.Posts = await RedditService.getPosts('heraldry')

        const { children } = heraldry.data

        const resultsH = await Promise.allSettled(children.map(element => {
            const { url_overridden_by_dest } = element.data
    
            //Some posts doesn't include any image links
            if (url_overridden_by_dest != null || url_overridden_by_dest != undefined) {
                if (url_overridden_by_dest!.length > 0) {
                    return url_overridden_by_dest
                }
            }
        }))
        
        const pictures = reddit(resultsH)

        const picture = pictures[Math.floor(Math.random() * pictures.length)]

        command.channel.send(picture)

        command.channel.stopTyping()
    }
}