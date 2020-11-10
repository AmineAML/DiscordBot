import TwitchClient from '../client/twitch-client'
import { callbackHubUrl } from '../utils/utils';
import { EXPIRATION_IN_SECONDS } from '../config'

/**
 * Finds a Twitch channel
 * @param channelName Twitch channel's name
 * @returns Array of channel's data
 */
export const getChannel = async(channelName: string) => {
    const { data } = await TwitchClient.get(`/search/channels?query=${channelName}`);
    return data;
}

/**
 * Finds Twitch channels that are live streaming
 * @param channelNames List of Twitch channels' names
 * @returns List of Twitch channels that are live streaming
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

    const data = {
        "hub.callback": url,
        "hub.mode": "subscribe",
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
 * Unsubscribe from Twitch webhook of topic streams of a channel with its id
 * @param channelId Twitch channel's id
 * @returns Webhook subscription's reponse status
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
 */
export const subscriptions = async() => {
    const data = await TwitchClient.get('/webhooks/subscriptions');
    return data;
}