import { Channel, WebhookChannelId, Youtuber, Stream } from '../models'
import { TwitchStreamers } from '../types'
import * as TwitchService from '../services/twitch-service'
import { EXPIRATION_IN_SECONDS, hook } from '../config'
import dotenv from 'dotenv'
import moment from 'moment'
import axios from 'axios'
import { callbackHubUrl, milliseconds, r, sleep } from './utils'
import * as YoutubeServices from '../services/youtube-service'

dotenv.config()

/**
 * Finds from an array of streamers those who're live streaming
 * @param streamers 
 * @param streamers.channelName Twitch or YouTube channel name
 * @param streamers.channelId Twitch or YouTube channel Id
 * @param streamers.type Accept t for Twitch and y for YouTube
 * @returns Array of objects of channels that are live streaming
 */
export const streaming = async (streamers: { channelName: string, channelId: string, type: string }[]) => {
    let twitchers: string[] = []
    let youtubers: string[] = []
    
    streamers.forEach(streamer => {
        if (streamer.type === 't') {
            twitchers.push(streamer.channelName)
        } else if (streamer.type === 'y') {
            youtubers.push(streamer.channelId)
        }
    })

    const channels: TwitchStreamers.UsersStreaming = await TwitchService.getLiveStreaming(twitchers);

    const { data } =  channels

    let youtubersStreaming: { channelName: string, channelUrl: string, thumbnail: string }[] = []

    await Promise.allSettled(youtubers.map(async youtuber => {
        const data = await YoutubeServices.getLiveStreaming(youtuber)

        if (data.length > 0) {
            data.forEach(channel => {
                youtubersStreaming.push({ channelName: channel.channelTitle, channelUrl: `https://www.youtube.com/watch?v=${channel.videoId}`, thumbnail: channel.thumbnail })
            })
        }
    }))

    let twitchersStreaming: { channelName: string, channelUrl: string, thumbnail: string }[] = []

    for (let i = 0; i < data.length; i++) {
        twitchersStreaming.push({ channelName: data[i].user_name, channelUrl: `https://www.twitch.tv/${data[i].user_name.toLowerCase()}`, thumbnail: data[i].thumbnail_url.replace('{width}', '480').replace('{height}', '360')})
    }

    let usersStreaming: { channelName: string, channelUrl: string, thumbnail: string }[] = twitchersStreaming.concat(youtubersStreaming)

    return usersStreaming
}

/**
 * Loads the streamers stored in the database
 * @param all Specify true for all channels including those of Twitch and YouTube, else those from YouTube
 * @returns List of streamers from the database
 */
export const streamersen = async (all: boolean) => {
    let streamers: { channelName: string, channelId: string, type: string }[] = []

    await Channel.find({}, async function(err, channels) {
        const results = await Promise.allSettled(channels.map(async streamer => {
            if (all) {
                return { channelName: streamer.channelName, channelId: streamer.channelId, type: streamer.type }
            }

            if (streamer.type == 'y') {
                return { channelName: streamer.channelName, channelId: streamer.channelId, type: streamer.type }
            }
        }))

        streamers = r(results)
    })

    return streamers
}

/**
 * Loads all channels's ids from the database
 * @returns List of channels's ids
 */
export const streamersenId = async () => {
    let streamers: string[] = []

    await Channel.find({}, async function(err, channels) {
        const results = await Promise.allSettled(channels.map(async streamer => {
            if (streamer.webhook) {
                return streamer.channelId
            }
        }))

        streamers = r(results)
    })

    return streamers
}

/**
 * Subscribe to a Twitch channel's webhook and with a successful subscription it adds it to the database
 * @param channelId Twitch channel's id
 * @param channelName Twitch channel's name
 * @param expiration Webhook expiration data
 * @param resubscribed Last webhook resubscription data
 * @retruns True for successfuly adding a new Twitch channel to the database and subscribing its webhook
 */
export const twitchChannelWebhook = async (channelId: string, channelName: string, expiration: Date, resubscribed: Date) => {
    let data: boolean | string

    const webhook = await TwitchService.subscribeWebhookChannel(channelId)
    console.log(`Webhook: ${webhook}`)


    if (webhook != 202) {
        data = false
        
        return data
    } 
    
    //Even if webhook equals to 202, it doesn't mean that it subscribed to it, because it does send a verification to the express server and validate the webhook subscription
    else {
        //Wait 10 seconds, that the Twitch API receive the webhook request, validate it, verify that this server's working and accepting it and by that the server automatically adds the channelId into the database which indicate that the webhook works
        const ms = milliseconds(10, 's')

        await sleep(ms)

        //Verify the channelId from the database' webhook
        const webhooked = await WebhookChannelId.exists({ channelId })

        if (!webhooked) {
            data = false

            return data
        } else {
            const cnl = await Channel.create({
                channelName,
                channelId,
                webhook: true,
                expiration,
                resubscribed,
                type: 't'
            })

            data = cnl.channelName

            if (data) {
                const cnlIdWebhook = await WebhookChannelId.deleteMany({ channelId })

                if (cnlIdWebhook.deletedCount! > 0) {
                    webhooksSubscriptionsVerification(channelId, true)

                    data = true

                    return data
                } else {
                    data = false

                    return data
                }
            }
        }
    }
}

/**
 * Resubscribe to the stream webhook of a Twitch channel
 * @param channelId Twitch channel's id
 * @returns True for a succesful resubscribing, else false. And a message for not founding the channel in the database
 */
export const twitchChannelWebhookResubscribe = async (channelId: string) => {
    let data: boolean | string

    //Removed channel are better not re subscribed
    const found = await Channel.exists({ channelId })

    if (found) {
        const webhook = await TwitchService.subscribeWebhookChannel(channelId)
        console.log(`Webhook: ${webhook}`)
    
        if (webhook != 202) {
            data = false
            
            return data
        } else {
            const exp = moment().add(EXPIRATION_IN_SECONDS, 'seconds').toDate()
    
            const resubscribed = moment().toDate()
    
            const cnl = await Channel.findOneAndUpdate({ channelId: channelId }, { expiration: exp, resubscribed: resubscribed })
    
            if (cnl) {
                data = true
    
                return data
            } else {
                data = false
    
                return data
            }
        }
    } else {
        data = 'Channel was deleted, not re subscribing'

        return data
    }
}

/**
 * Loads from the database all Twitch channels' ids, webhook subscription's expiration and last resubscription to the webhook
 * @returns List of Twitch channels webhooks
 */
export const streamersenIdAndExpiration = async () => {
    let streamers: {channelId: string, expiration: Date, resubscribed: Date}[] = []

    await Channel.find({}, async function(err, channels) {
        const results = await Promise.allSettled(channels.map(async streamer => {
            if (streamer.webhook && streamer.type === 't') {
                return { channelId: streamer.channelId, expiration: streamer.expiration, resubscribed: streamer.resubscribed }
            }
        }))

        streamers = r(results)
    })

    return streamers
}

/**
 * Adds the Twitch channel's id to the database so it allow to confirm that the webhook subscription's successful
 * @param channelId Twitch channel's id
 */
export const webhookConfirmChannelById = async(channelId: string) => {
    const webhookChannelId = await WebhookChannelId.create({
        channelId
    })

    if (webhookChannelId) {
        console.log(webhookChannelId)
    }
}

export const isDevPubUrlWorking = async() => {
    let res

    await axios({
        url: `${callbackHubUrl()}/devpuburl`,
        method: 'get'
    })
    .then((response: any) => {
        res = response.status

        console.log(response.data)
    })
    .catch(function (error: any) {
        if (error.response) {
            res = error.response.status
        }
    });

    return res == 200 ? true : false
}

/**
 * Resubscribe each an hour to expired Twitch channels webhooks
 * @param channelId Twitch channel's id
 * @param isNewChannel True for a new added Twitch channel, else false
 */
export const webhooksSubscriptionsVerification = async(channelId: string, isNewChannel: boolean) => {
    console.log('Re subscribe')

    //Verify that the channel was not deleted from the database
    const found = await Channel.exists({ channelId })

    console.log(found)

    if (found) {
        if (!isNewChannel) {
            //Re subscribe using the Twitch channel id
            const sub = await twitchChannelWebhookResubscribe(channelId)

            if (sub === true) {
                console.log('Re subscribed successfully')

                const TwitchMS = EXPIRATION_IN_SECONDS * 1000 - milliseconds(1,'h')

                setTimeout(() => webhooksSubscriptionsVerification(channelId, false), TwitchMS)
            } else if (sub === false) {
                const retry = milliseconds(20, 'm')
                
                console.log(`Error, couldn\'t re subscribe. Retrying in 20 minutes`)

                setTimeout(() => webhooksSubscriptionsVerification(channelId, false), retry)
            } else {
                console.log(sub)
            }
        } else {
            const TwitchMS = EXPIRATION_IN_SECONDS * 1000 - milliseconds(1, 'h')

            setTimeout(() => webhooksSubscriptionsVerification(channelId, false), TwitchMS)
        }
    }
}

/**
 * Initialize the resubscription to Twitch channels' webhook
 */
export const webhookResubscriptionsManagement = async() => {
    //Retrieve all added Twitch channels from the database
    const streamers = await streamersenIdAndExpiration()

    //Found a channel or more saved in the database
    if (streamers.length > 0) {
        streamers.forEach(async streamer => {
        const { expiration, channelId, resubscribed } = streamer

        const exp = moment(expiration)

        const current = moment()

        const resubsc = moment(resubscribed)

        console.log('Re subscription ' + exp.diff(current, 'hours', true))

        console.log('Already re subscribed ' + current.diff(resubsc, 'hours', true))

        const minimumHours = 1

        await sleep(10000)

        if (exp.diff(current, 'hours', true) <= minimumHours) {
            //Verify with node development each refresh with 1 hour or less does resubscribe, that's why insert the newest re subscription and verify it with current and if it's an 1 hour or less don't re subscribe
            if (current.diff(resubsc, 'hours', true) >= minimumHours) {
                console.log(channelId)

                webhooksSubscriptionsVerification(channelId, false)
            } else {
                console.log('Already re subscribed')

                //Re subscribe with webhook expiration subscription
                const TwitchMS = EXPIRATION_IN_SECONDS * 1000 - milliseconds(minimumHours, 'h')

                setTimeout(() => webhooksSubscriptionsVerification(channelId, false), TwitchMS)
            }
        } else {
                console.log('Don\'t re subscribe')

                //Re subscribe with webhook expiration subscription
                const ms = exp.diff(current, 'ms', true) - milliseconds(minimumHours, 'h')

                setTimeout(() => webhooksSubscriptionsVerification(channelId, false), ms)
            }
        })
    }
}

/**
 * Use webhooks to post a message to Discord Server each 20 minutes with YouTube channel's new live stream
 */
export const youtuberLiveStreaming = async () => {
    //Send get request to https://www.youtube.com/channel/<CHANNEL_ID>/live and/or https://www.youtube.com/c/<CHANNEL_NAME>/live and/or https://www.youtube.com/user/<CHANNEL_NAME>/live and query with live streams and with channel or channels that are live streaming use the API to retrieve the or all live stream or streams' video id or ids
    const streamersens = await streamersen(false)

    console.log(streamersens)

    let youtubers: string[] = []

    streamersens.forEach(streamer => {
        youtubers.push(streamer.channelId)
    })

    console.log(youtubers)

    let youtubersStreaming: string[] = []

    await Promise.allSettled(youtubers.map(async channelId => {
        const isLiveStreaming = await YoutubeServices.channelLiveStreaming(channelId)

        console.log(isLiveStreaming)

        if (isLiveStreaming) {
            //Verify that the live stream's of the same day
            const stream = await Stream.findOne({ channelId }).exec()

            console.log(stream)

            //Didn't find the channel meaning it's a new channel
            if(stream == null) {
                const liveStreamingWebhooks: string[] = await youtuberLiveStreamingWebhook(channelId)

                if (liveStreamingWebhooks.length > 0) {
                    liveStreamingWebhooks.forEach(liveStreamingWebhook => {
                        youtubersStreaming.push(liveStreamingWebhook)
                    })
                }
            } else {
                const current = moment()

                const streamed = moment(stream!.stream)

                const isOfSameDayLiveStreamingChannel = current.isSame(streamed, "d")

                if (!isOfSameDayLiveStreamingChannel) {
                    const liveStreamingWebhooks: string[] = await youtuberLiveStreamingWebhook(channelId)

                    if (liveStreamingWebhooks.length > 0) {
                        liveStreamingWebhooks.forEach(liveStreamingWebhook => {
                            youtubersStreaming.push(liveStreamingWebhook)
                        })
                    }
                }
            }
        }
    }))

    if (youtubersStreaming.length > 0) {
        hook !== false ? hook.send(youtubersStreaming.join('\n')) : ''
    }

    setTimeout(() => youtuberLiveStreaming(), milliseconds(20, 'm'))
}

/**
 * Finds video id or more of a given channel's id's new live streams
 * @param channelId YouTube channel's id
 * @returns Array of messages with the channel's name and its live stream link
 */
const youtuberLiveStreamingWebhook = async (channelId: string) => {
    let youtubersStreaming: string[] = []

    const data = await YoutubeServices.getLiveStreaming(channelId)

    console.log(data)

    if (data.length > 0) {
        data.forEach(async channel => {
            const { channelTitle, videoId, publishedAt } = channel

            //videoId and its publishedAt comparaison that channel is live streaming a new live stream or a previous live stream
            const video = await Youtuber.findOne({ videoId: videoId }).exec()

            //VideoId exists
            if (video != null) {
                const dbPublishedAt = moment(publishedAt)

                const apiPublishedAt = moment(video.publishedAt)

                const isNewVideoLiveStream = dbPublishedAt.isSame(apiPublishedAt)
                
                //New live stream
                if (!isNewVideoLiveStream) {
                    youtubersStreaming.push(`@everyone ${channelTitle} is live streaming! Here's a link: https://www.youtube.com/watch?v=${videoId}`)

                    await Youtuber.findOneAndUpdate({ videoId }, { publishedAt: apiPublishedAt.toDate() })

                    await Stream.findOneAndUpdate({ channelId }, { stream: moment().toDate() }, { upsert: true })

                    console.log('Added the channel video live stream')
                } else {
                    await Stream.findOneAndUpdate({ channelId }, { stream: moment().toDate() }, { upsert: true })

                    console.log('Added the channel video live stream')
                }
            } else {
                youtubersStreaming.push(`@everyone ${channelTitle} is live streaming! Here's a link: https://www.youtube.com/watch?v=${videoId}`)

                const cnl = await Youtuber.create({
                    videoId,
                    publishedAt,
                    channelId
                })

                if (!cnl) {
                    console.log('Error adding the videoId')
                } else {
                    await Stream.findOneAndUpdate({ channelId }, { stream: moment().toDate() }, { upsert: true })

                    console.log('Added the videoId')

                    console.log('Added the channel video live stream')
                }
            }
        })
    } else {
        console.log(`Channel with the id of ${channelId}'s live streaming but couldn't get the id of the video`)
    }

    return youtubersStreaming
}

/**
 * Recommends a user from a Twitch game/category
 * @param game Twitch game/category's name
 * @returns Object of channel
 */
export const twitchChannelRecommendation = async(game: string) => {
    let channel: { name: string, image: string, description: string } | undefined

    const resG: any = await TwitchService.game(game)

    const games = resG.data

    if (games.length > 0) {
        const id = games[0].id

        console.log(id)

        const resC: any = await TwitchService.channelByGame(id)

        const channels = resC.data

        if (channels.length > 0) {
            const { user_name, user_id } = channels[Math.floor(Math.random() * channels.length)]

            console.log(user_name)

            const resU: any = await TwitchService.user(user_id)

            console.log(resU)

            const user = resU.data

            if (user.length > 0) {
                console.log(user)

                const { profile_image_url, description } = user[0]

                channel = {
                    name: user_name,
                    image: profile_image_url,
                    description: description
                }
            }
        }
    }

    return channel
}