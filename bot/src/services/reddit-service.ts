import RedditClient from '../client/reddit-client'

/**
 * Loads posts of a subreddit
 * @param subreddit Reddit's subreddit's name
 * @returns Subreddit posts
 */
export const getPosts = async(subreddit: string) => {
    const { data } = await RedditClient.get(`/r/${subreddit}.json?limit=100`);
    return data;
}

/**
 * Loads comments from a post
 * @param url Subreddit's post link
 * @returns Post's comments
 * @throws Does not work with links that contain characters like the word yorùbá
 */
export const getPostComments = async(url: string) => {
    const { data } = await RedditClient.get(`${url}`);
    return data;
}