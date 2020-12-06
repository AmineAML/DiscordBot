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

    //sortByTheMostUsedWords(selftexts)

    const resultsL = await Promise.allSettled(children.map(element => {
        const { num_comments } = element.data

        //Some posts doesn't include any comments
        if (num_comments > 0) {
            return element.data.permalink
        }
    }))

    const links = r(resultsL)

    const bestPostMatch = stringSimilarity.findBestMatch(message, selftexts).bestMatchIndex

    //Example of error: Error: Bad arguments: First argument should be a string, second should be an array of strings
    console.log(links[bestPostMatch])

    const link: string = links[bestPostMatch].substring(0, links[bestPostMatch].length - 1) + ".json"

    console.log(link)

    const redditPostComment = await RedditService.getPostComments(link)

    let botUserMessage

    const resultsC = await Promise.allSettled(redditPostComment[1].data.children.map((element: any) => {
        const { author, body } = element.data

        //Some posts does include a bot comment as the first comment (which usally say a subreddit's rules) and don't use it
        if (author) {
            if (!author.toLowerCase().includes('bot') || !author.toLowerCase().includes('AutoModerator')) {
                return body
            }
        } else {
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

/**
 * Finds the subreddit which the user message inludes most of its keywords
 * @param userMessageContent User message
 * @returns Subreddit name or undifined for the user message not including any keywords
 */
export const getSubredditLink = async (userMessageContent: string) => {
    let subreddit: string | undefined

    //Reddit's subreddits keywords
    let subreddits = {
        getDisciplined: 'time work about life thing feel people doing going habit need think hard sleep goal yourself try help better still brain being able keep schedule progress gym wake focus social friend discipline improve motivation job advice success mental hope self health problem important mind learn mental activities activity willpower procrastination achieve'.split(" "),
        socialSkills: 'people about want all friend talk being would make social been think life friend said try talk help conversation thing will well going able other advice self better stuff please anxiety hate conversation reason awkward family experience felt thank speak personal introvert tone laugh respect insecure relationship convo toxic anxious party support'.split(" "),
        etiquette: 'want gift time feel family people friend something rude thank ask work etiquette thing need kind going self parent friend wedding received party eat doing appropriate try question problem invite consider starte appreciate ask sending proper serveral guest drink situation tried appreciate social celebrate wonder help knowledge suggestion manner'.split(" "),
        confidence: 'you have feel about people sef confidence friend being life confident will person self better help stupid doing love try talk change feeling social anxiety esteem problem yourself felt advice pretty happy thought huge improve talk work seem kind depression insecure making accept care time afraid learn hope family situation think health mental anxious awkward attractive matter'.split(" "),
        decidingToBeBetter: 'like self feel know life time been get about people thing better friend doing start need try help give decide habit working talk person used social start best felt feel goal family habit afraid thought relationship progress scare hope please yourself mentall health advice problem kind successful think please stress anxiety health toxic care difficult'.split(" "),
        selfimprovement: 'learning mind improve focus success thought feel interest progress yourself successful find important advice process situation anxiety depression implement burnout habit emotion care relationship problem talk feel dream hope personal tired goal energy importance'.split(" "),
        relationshipAdvice: 'my she he her him for me his time has feel want said from being relationship other make work together love self life help family think try talk need advice friend tell people parent wife husband want guy girl person find situation thing tried couple felt dating kid married daughter son conversation sex mother father mom dad ex bf gf partner boy marriage'.split(" "),
        relationship: 'him she my me her him time feel want relationship said has thing had told being friend together life self love talk will want family people felt help someone partner talk conversation sex person situation tried ex anxiety advice think problem another parent dad mom father mother sister brother dating issue girl boy guy husband wife sexual couple'.split(" ")
    }

    //Keywords matches count with user message
    let subredditsValues: any = {
        getDisciplined: 0,
        socialSkills: 0,
        etiquette: 0,
        confidence: 0,
        decidingToBeBetter: 0,
        selfimprovement: 0,
        relationshipAdvice: 0,
        relationship: 0
    }

    for (const [key, value] of Object.entries(subreddits)) {
        subredditsValues[key] += await keywordsObjectIncrement(value, userMessageContent)
    }

    //console.log(subredditsValues)

    //Descinding sorting into an array from an object
    const subredditsSorted = Object.keys(subredditsValues).sort((a, b) => subredditsValues[b] - subredditsValues[a])

    //console.log(subredditsSorted)

    let subredditsValuesIncrement = 0
    
    for (const [key, value] of Object.entries(subredditsValues)) {
        subredditsValuesIncrement += value as number
    }

    //console.log(subredditsValuesIncrement)

    //A subreddit or more incremented
    if (subredditsValuesIncrement > 0) {
        if (subredditsSorted[0] == 'getDisciplined') {
            subreddit = 'getdisciplined'
        } else if (subredditsSorted[0] == 'socialSkills') {
            subreddit = 'socialskills'
        } else if (subredditsSorted[0] == 'etiquette') {
            subreddit = 'etiquette'
        } else if (subredditsSorted[0] == 'confidence') {
            subreddit = 'confidence'
        } else if (subredditsSorted[0] == 'decidingToBeBetter') {
            subreddit = 'DecidingToBeBetter'
        } else if (subredditsSorted[0] == 'selfimprovement') {
            subreddit = 'selfimprovement'
        } else if (subredditsSorted[0] = 'relationshipAdvice') {
            subreddit = 'relationship_advice'
        } else if (subredditsSorted[0] == 'relationship') {
            subreddit = 'relationship'
        }
    }

    return subreddit
}

/**
 * Sums all keywords counts that are from the user message
 * @param keywords Subreddit keywords
 * @param userMessageContent User message
 * @returns Sum of keywords
 */
const keywordsObjectIncrement = async (keywords: string[], userMessageContent: string) => {
    let keywordsObject: any = {}

    //Convert keywords array into an object with keys and values initialized with 0
    keywords.forEach(key => Object.assign(keywordsObject, { [key]: 0 }))

    //Increment word from object that are included from the user message
    Object.keys(keywordsObject).forEach(function (word, index) {
        if (userMessageContent.includes(word)) {
            keywordsObject[word]++
        }
    })

    let keywordsValue = 0

    //Sum of all keywords
    for (const [key, value] of Object.entries(keywordsObject)) {
        keywordsValue += value as number
    }

    return keywordsValue
}