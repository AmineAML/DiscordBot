import RedditClient from '../client/reddit-client'

export const getPosts = async(subreddit: string) => {
    const { data } = await RedditClient.get(`/r/${subreddit}.json?limit=100`);
    return data;
}

//Link that contains characters from words like this 'yorùbá does not work
export const getPostComments = async(url: string) => {
    const { data } = await RedditClient.get(`${url}`);
    return data;
}