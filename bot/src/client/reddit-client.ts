import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

const config: AxiosRequestConfig = {
    baseURL: 'https://www.reddit.com'
}

/**
 * Creates a Reddit Client for reddit.com public API
 */
class RedditClient {
    instance: AxiosInstance

    constructor() {
        this.instance = axios.create(config)
    }

    /**
     * 
     * @param path Relative path
     * @example
     * import RedditClient from '../client/reddit-client'
     * 
     * export const getPosts = async() => {
     * const { data } = await RedditClient.get(`/r/programmerhumor.json?limit=100`);
     *  return data;
     * }
     * @memberof RedditClient
     */
    get(path: string) {
        return this.instance.get(path);
    }
}
export default new RedditClient