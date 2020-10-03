import axios from 'axios'

const config = {
    baseURL: 'https://www.reddit.com'
}

class RedditClient {
    instance: any

    constructor() {
        this.instance = axios.create(config)
    }

    get(path:any) {
        return this.instance.get(path);
    }
}
export default new RedditClient