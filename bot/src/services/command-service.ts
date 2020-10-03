import { Client } from "@typeit/discord"
import { Channel, RedditPosts } from '../models'
import * as TwitchService from './twitch-service'
import * as RedditService from '../services/reddit-service'
import stringSimilarity from 'string-similarity'

export const botCommands = async () => {
    let commands: string[] = []
    Client.getCommands().forEach(element => {
        commands.push(`     !${element.commandName}: ${element.description}`)
    })
    return commands.join('\n')
}

export const streaming = async (streamers: string[]) => {
    const results = await Promise.allSettled(streamers.map(async streamer => {
      const channel = await TwitchService.getChannel(streamer);
      const { is_live, display_name } = channel.data[0]
      return is_live ? `${streamer} is live streaming! Here's a link https://www.twitch.tv/${display_name}` : '' 
    }));
    const success = []
    const failed = []
  
    for (const result of results) {
      if (result.status === 'rejected') { 
        failed.push(result.reason)
        continue 
      }
      if(result.value) {
        success.push(result.value)
      }
    }

    //A request or more didn't work
    if (failed) {
        console.error(failed)   
    }

    return success.join('\n')
}

export const streamersen = async () => {
    let streamers: string[] = []

    await Channel.find({}, async function(err, channels) {
        const results = await Promise.allSettled(channels.map(async streamer => {
            return streamer.channelName
        }))

        const failed = []
      
        for (const result of results) {
          if (result.status === 'rejected') { 
            failed.push(result.reason)
            continue 
          }
          if(result.value) {
            streamers.push(result.value.toString())
          }
        }
    
        //A request or more didn't work
        if (failed) {
            console.error(failed)   
        }
    })

    return streamers
}

export const reddit = (results: any) => {
    const success = []
    const failed = []
              
    for (const result of results) {
        if (result.status === 'rejected') { 
            failed.push(result.reason)
            continue 
        }
        if(result.value) {
            success.push(result.value)
        }
    }
    
    //A request or more didn't work
    if (failed.length > 0) {
        console.error(failed)   
    }

    return success
}

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
    
    const selftexts = reddit(resultsT)
    
    const resultsL = await Promise.allSettled(children.map(element => {
        return element.data.permalink
    }))
    
    const links = reddit(resultsL)
    
    const bestPostMatch = stringSimilarity.findBestMatch(message, selftexts).bestMatchIndex
                
    console.log(links[bestPostMatch])
    
    const link: string = links[bestPostMatch].substring(0, links[bestPostMatch].length - 1) + ".json"

    console.log(link)
    
    const redditLanguagesPostComment = await RedditService.getPostComments(link)
                
    let botUserMessage

    const resultsC = await Promise.allSettled(redditLanguagesPostComment[1].data.children.map((element: any) => {
        const { author, body } = element.data

        //Some posts does include a bot comment as the first comment (which usally say a subreddit's rules) and don't use it
        if (!author.toLowerCase().includes('bot') || !author.toLowerCase().includes('AutoModerator')) {

            return element.data.body
        }
    }))

    const comments = reddit(resultsC)

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