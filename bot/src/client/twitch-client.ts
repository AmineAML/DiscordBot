import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import dotenv from 'dotenv'
import * as AxiosLogger from 'axios-logger'
import moment from 'moment'

dotenv.config()

//App access token
const {
    TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET
} = process.env

let access_token: string

let expire_token: moment.Moment

let current: moment.Moment

const Twitch = {
    /**
     * Twitch API app access token
     */
    getAccessToken() {
        //Access token does expire, it should also verify its expiration and if it's expired, generate a new access token
        current = moment()
        if (access_token && expire_token.diff(current, 'hours') >= 1) {
            return access_token;
        } else {
            axios({
                url: 'https://id.twitch.tv/oauth2/token',
                method: 'post',
                params: {
                    grant_type: 'client_credentials',
                    client_id: TWITCH_CLIENT_ID,
                    client_secret: TWITCH_CLIENT_SECRET
                }
            }).then(function(response) {
                access_token = response.data.access_token

                console.log(access_token)

                expire_token = moment().add(response.data.expires_in, 'seconds')
            })
        }
    },
}

const config: AxiosRequestConfig = {
    baseURL: 'https://api.twitch.tv/helix',
    headers: { 
                'Accept': 'application/vnd.twitchtv.v5+json'
            },
}

/**
 * Creates a Twitch Client for the twitch.tv API
 */
class TwitchClient {
    access_token = Twitch.getAccessToken();
    
    instance: AxiosInstance

    constructor() {
        this.instance = axios.create(config)

        this.instance.interceptors.request.use((config: AxiosRequestConfig) => {
            config.headers[`Client-Id`] = TWITCH_CLIENT_ID!;
            config.headers.Authorization = `Bearer ${access_token}`;
            //console.log(config)
    
            return config
        })

        this.instance.interceptors.request.use(AxiosLogger.requestLogger)

        this.instance.interceptors.response.use(AxiosLogger.responseLogger)
    }

    /**
     * 
     * @param path Relative path
     * @example
     * import TwitchClient from '../client/twitch-client'
     * 
     * export const getChannel = async() => {
     *  const { data } = await TwitchClient.get(`/search/channels?query=nasa`);
     *  return data;
     * }
     * @memberof TwitchClient
     */
    get(path: string) {
        return this.instance.get(path);
    }

    /**
     * 
     * @param path Relative path
     * @param data Data object
     * @example
     * import TwitchClient from '../client/twitch-client'
     * 
     * export const subscribeWebhookChannel = async() => {
     *  let res

     *  await TwitchClient.post('/webhooks/hub', {
     *      "hub.callback": 'https://www.example.com',
     *      "hub.mode": "subscribe",
     *      "hub.topic": `https://api.twitch.tv/helix/streams?user_id=7777777`,
            "hub.lease_seconds": 90000
     *  })
     *  .then((response: any) => {
     *      res = response.status
     *  })
     *  .catch(function (error: any) {
     *      if (error.response) {
     *          res = error.response.status
     *      }
     *  });
     *  return res;
     *  }
     * @memberof TwitchClient
     */
    post(path: string, data: any) {
        return this.instance.post(path, data);
    }
}

/**
 * Revoke access token of the Twitch API
 */
export const revokeAccessToken = async() => {
    let res

    await axios({
        url: 'https://id.twitch.tv/oauth2/revoke',
        method: 'post',
        params: {
            client_id: TWITCH_CLIENT_ID,
            token: access_token
        }
    })
    .then((response: any) => {
        res = response.status
    })
    .catch(function (error: any) {
        if (error.response) {
            res = error.response.status
        }
    });

    if (res == 200) {
        console.log('Twitch access token revoked securely')
    } else {
        console.log('Couldn\'t revoke the Twitch access token, or it\'s invalid')
    }
}

//OAuth
/*const {
    TWITCH_OAUTH_TOKEN
} = process.env

let client_id: string

const Twitch = {
    getClientId() {
        if (client_id) {
            //Access token does expire meaning it should also verify it does and if it does, generate a new access token
            return client_id;
        } else {
            axios({
                url: 'https://id.twitch.tv/oauth2/validate',
                method: 'get',
                headers: {
                    Authorization: `OAuth ${TWITCH_OAUTH_TOKEN}`
                }
            }).then(function(response) {
                client_id = response.data.client_id
                console.log(client_id)
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
    access_token = Twitch.getClientId();
    //console.log(access_token)
    instance: any

    constructor() {
        this.instance = axios.create(config)

        this.instance.interceptors.request.use((config: { headers: { 'Client-Id': string; Authorization: string; }; }) => {
            config.headers[`Client-Id`] = client_id;
            config.headers.Authorization = `Bearer ${TWITCH_OAUTH_TOKEN}`;
            //console.log(config)
    
            return config
        })

        this.instance.interceptors.request.use(AxiosLogger.requestLogger)

        this.instance.interceptors.response.use(AxiosLogger.responseLogger)
    }

    get(path:any) {
        return this.instance.get(path);
    }

    post(path:any, json: any) {
        return this.instance.post(path, json);
    }
}
*/
export default new TwitchClient