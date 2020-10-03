import TwitchClient from '../client/twitch-client'

export const getChannel = async(channelName: string) => {
    const { data } = await TwitchClient.get(`/search/channels?query=${channelName}`);
    return data;
}