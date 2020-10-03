import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const {
    OAUTH_TOKEN
} = process.env

let client_id: string

const Twitch = {
    getAccessToken() {
        if (client_id) {
            return client_id;
        } else {
            axios({
                url: 'https://id.twitch.tv/oauth2/validate',
                method: 'get',
                headers: {
                    Authorization: `OAuth ${OAUTH_TOKEN}`
                }
            }).then(function(response) {
                client_id = response.data.client_id
                //console.log(client_id)
            })//.catch(function(error) {});
        }
    }
}

const config = {
    baseURL: 'https://api.twitch.tv/helix',
    headers: { 
                'Accept': 'application/vnd.twitchtv.v5+json'
            },
}

class TwitchClient {
    access_token = Twitch.getAccessToken();
    //console.log(access_token)
    instance: any

    constructor() {
        this.instance = axios.create(config)

        this.instance.interceptors.request.use((config: { headers: { 'Client-Id': string; Authorization: string; }; }) => {
            config.headers[`Client-Id`] = client_id;
            config.headers.Authorization = `Bearer ${OAUTH_TOKEN}`;
            //console.log(config)
    
            return config
        })
    }

    get(path:any) {
        return this.instance.get(path);
    }
}
export default new TwitchClient