import { youtube } from '../client/youtube-client'
import axios from 'axios'

/**
 * Finds a YouTube channel
 * @param channelName YouTube channel's name
 * @returns The channel's id
 */
export const getChannel = async(channelName: string) => {
    let channelId
    
    await youtube.channels.list({
        part: [
          "snippet,contentDetails,statistics"
        ],
        
        //Remove space and/or spaces from the string
        forUsername: channelName.replace(/ /gi, '').toLowerCase()
    })
    .then(async (resL) => {
        console.log(resL.data)

        //Found the username, some channels use the same name for the username and the channel name and it's better to make sure it's the channel name because the channel list's using the username
        if (resL.data.pageInfo!.totalResults! > 0) {
            //Compare the username to the channel name
            if (channelName == resL.data.items![0].snippet!.title) {
                console.log('Username\'s the same as the channel name')

                channelId = resL.data.items![0].id!
      
                console.log(channelId)
            } else {
                console.log('Username\'s not the same as the channel name')

                await youtube.search.list({
                    part: [
                        "snippet"
                    ],
                    type: [
                        "channel"
                    ],
                    q: channelName
                })
                .then((resS) => {
                    console.log(resS.data)

                    if (resS.data.pageInfo!.totalResults! > 0) {

                        channelId = resS.data.items![0].id!

                        console.log(channelId)
                    } else {
                        channelId = false
                    }
                })
                .catch((err) => {
                    console.log(err)

                    channelId = false
                })
            }
        } else {
            console.log('Didn\'t find the username')

            await youtube.search.list({
                part: [
                    "snippet"
                ],
                type: [
                    "channel"
                ],
                q: channelName
            })
            .then((resAl) => {
                if (resAl.data.pageInfo!.totalResults! > 0) {
                    channelId = resAl.data.items![0].id!.channelId

                    console.log(channelId)
                } else {
                    channelId = false
                }
            })
            .catch((err) => {
                console.log(err)

                channelId = false
            })
        }
    })
    .catch((err) => {
        console.log(err)

        channelId = false
    })

    return channelId
}

/**
 * Finds live streams of a YouTube channel
 * @param channelId YouTube channel's id
 * @returns Array of live streaming videos of a channel
 */
export const getLiveStreaming = async(channelId: string) => {
    let data: { channelTitle: string, videoId: string, publishedAt: string }[] = []

    await youtube.search.list({
        part: [
            "snippet"
        ],
        eventType: "live",
        type: [
            "video"
        ],
        channelId: channelId
    })
    .then((res) => {
        console.log(res.data.pageInfo!.totalResults)
    
        if (res.data.pageInfo!.totalResults! > 0) {
            const { items } = res.data
    
            //console.log(items)

            items!.forEach(item => {
                data.push({ channelTitle: item.snippet!.channelTitle!, videoId: item.id!.videoId!, publishedAt: item!.snippet!.publishedAt! })
            })
        }
    })
    .catch((err) => {
        console.log(err)
    })

    return data
}

/**
 * Finds that a YouTube channel's live streaming or not
 * @param channelId YouTube channel's id
 * @returns True for a YouTube channel which's live streaming, else false
 */
export const channelLiveStreaming = async (channelId: string) => {
    let res
    let data

    await axios({
        url: `https://www.youtube.com/channel/${channelId}/live`,
        method: 'get',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Accept-Language': 'en-US,q=0.5'
        }
    })
    .then((response) => {
        const html = response.data

        res = html.search(/https:\/\/i.ytimg.com\/vi\/[A-Za-z0-9\-_]+\/hqdefault_live.jpg/i)

        console.log(`Res ${res}`)

        if (res >= 0) {
            data = true
        } else {
            data = false
        }
    })
    .catch(function (error: any) {
        console.log(error)
    });

    return data
}