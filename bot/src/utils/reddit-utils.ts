import { RedditPosts } from '../types'
import * as RedditService from '../services/reddit-service'
import stringSimilarity from 'string-similarity'
import { r } from './utils'

/**
 * Given a user's message, and the subreddit which the message's subject's about, assign the bot an answer from Reddit
 * @param subreddit Reddit's subreddit's name
 * @param message Provided by the user from the Discord Server
 * @returns Message back to the user
 */
export const getBotMessage = async (subreddit: string, message: string) => {
    //const redditLanguagesPosts: RedditPosts.Posts = await require("../../assets/reddit-posts-example.json")
    const redditLanguagesPosts: RedditPosts.Posts = await RedditService.getPosts(subreddit)

    const { children } = redditLanguagesPosts.data

    //Rather than using the title, you can use the content of that title
    const resultsT = await Promise.allSettled(children.map(element => {
        const { num_comments, selftext } = element.data

        //Some posts doesn't include any comments
        if (num_comments > 0) {
            return selftext
        }
    }))
    
    const selftexts = r(resultsT)
    
    const resultsL = await Promise.allSettled(children.map(element => {
        return element.data.permalink
    }))
    
    const links = r(resultsL)
    
    const bestPostMatch = stringSimilarity.findBestMatch(message, selftexts).bestMatchIndex
                
    console.log(links[bestPostMatch])
    
    const link: string = links[bestPostMatch].substring(0, links[bestPostMatch].length - 1) + ".json"

    console.log(link)
    
    const redditPostComment = await RedditService.getPostComments(link)
                
    let botUserMessage

    const resultsC = await Promise.allSettled(redditPostComment[1].data.children.map((element: any) => {
        const { author, body } = element.data

        //Some posts does include a bot comment as the first comment (which usally say a subreddit's rules) and don't use it
        if (!author.toLowerCase().includes('bot') || !author.toLowerCase().includes('AutoModerator')) {

            return body
        }
    }))

    const comments = r(resultsC)

    const comment = stringSimilarity.findBestMatch(message, comments)
    
    botUserMessage = comment.bestMatch.target

    console.log(comment.bestMatch)

    console.log(botUserMessage)

    //Don't include the edit from the user's comment, also note that if the edit as a word is part of the comment and not a modification it can delete it
    if (botUserMessage.toLowerCase().includes('edit')) {
        botUserMessage = botUserMessage.substring(0, botUserMessage.indexOf('Edit' || 'edit'))
    }

    return botUserMessage
}