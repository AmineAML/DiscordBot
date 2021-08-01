import TwitchClient from '../client/twitch-client'
import { callbackHubUrl } from '../utils/utils';
import { EXPIRATION_IN_SECONDS } from '../config'

/**
 * Finds a Twitch channel
 * @param channelName Twitch channel's name
 * @returns Object of channel's data
 */
export const getChannel = async(channelName: string) => {
    const { data } = await TwitchClient.get(`/search/channels?query=${channelName}`);
    return data;
}

/**
 * Finds Twitch channels that are live streaming
 * @param channelNames List of Twitch channels' names
 * @returns Arrays of objects of Twitch channels that are live streaming
 */
export const getLiveStreaming = async(channelNames: string[]) => {
    const { data } = await TwitchClient.get(`/streams?user_login=${channelNames.join('&user_login=')}`);
    return data;
}

/**
 * Subscribe to Twitch webhook of topic streams of a channel with its id
 * @param channelId Twitch channel's id
 * @returns Webhook subscription's response status
 */
export const subscribeWebhookChannel = async(channelId: string) => {
    const url = await callbackHubUrl()

    let res

    // const data = {
    //     "hub.callback": url,
    //     "hub.mode": "subscribe",
    //     "hub.topic": `https://api.twitch.tv/helix/streams?user_id=${channelId}`,
    //     "hub.lease_seconds": EXPIRATION_IN_SECONDS
    // }

    const data = {
        "type": "stream.online",
        "version": "1",
        "condition": {
            "broadcaster_user_id": channelId
        },
        "transport": {
            "method": "webhook",
            "callback": url,
            "secret": "38a1f5844640cd47aafb"
        }
    }

    await TwitchClient.post('/eventsub/subscriptions', data)
    .then((response: any) => {
        // console.log(response)

        res = response.status
    })
    .catch(function (error: any) {
        if (error.response) {
            // console.log(error.response)

            res = error.response.status
        }
    });
    return res;
}

/**
 * Unsubscribe from Twitch webhook of topic streams of a channel with its id
 * @param channelId Twitch channel's id
 * @returns Webhook subscription's response status
 */
export const unsubscribeWebhookChannel = async(channelId: string) => {
    const url = await callbackHubUrl()

    let res

    const data = {
        "hub.callback": url,
        "hub.mode": "unsubscribe",
        "hub.topic": `https://api.twitch.tv/helix/streams?user_id=${channelId}`,
        "hub.lease_seconds": EXPIRATION_IN_SECONDS
    }
    
    await TwitchClient.post('/webhooks/hub', data)
    .then((response: any) => {
        //console.log(response)

        res = response.status
    })
    .catch(function (error: any) {
        if (error.response) {
            //console.log(error.response)

            res = error.response.status
        }
    });
    return res;
}

/**
 * List of Twich webhook subscriptions
 * @returns List of webhooks subscriptions
 */
export const subscriptions = async() => {
    const data = await TwitchClient.get('/webhooks/subscriptions');
    return data;
}

/**
 * Finds a Twitch game/category
 * @param gameName Twitch's game/category name
 * @returns Array of games that match the query
 */
export const game = async(gameName: string) => {
    const { data } = await TwitchClient.get(`/games?name=${encodeURIComponent(gameName)}`);
    return data;
}

/**
 * Finds channels under a game/category
 * @param gameId Twitch game/category's id
 * @returns Arrays of objects of channels
 */
export const channelByGame = async(gameId: string) => {
    const { data } = await TwitchClient.get(`/streams?game_id=${gameId}`);
    return data;
}

/**
 * Finds a Twitch user
 * @param userId Twitch channel's user id
 * @returns Arrays of objects of users
 */
export const user = async(userId: string) => {
    const { data } = await TwitchClient.get(`/users?id=${userId}`);
    return data;
}

/**
 * List of top Twitch games/categories
 * @returns Arrays of objects of games/categories
 */
export const games = async() => {
    const { data } = await TwitchClient.get('/games/top?limit=100');
    return data;
}