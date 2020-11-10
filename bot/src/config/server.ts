import dotenv from "dotenv"
import ngrok from 'ngrok';
import { IN_PROD, PORT } from './app';

const LocalXpose = require('localxpose')

dotenv.config()

const {
    NGROK_AUTHTOKEN,
    LOCALXPOSE_ACCESS_TOKEN,
    LOCALXPOSE_SUBDOMAIN,
} = process.env

export const NGROK_URL = ngrok.connect({
    proto: 'http',
    addr: PORT,
    authtoken: NGROK_AUTHTOKEN
})

export const client = new LocalXpose(LOCALXPOSE_ACCESS_TOKEN)

const LOCALXPOSE_URL = client.http({
    region: 'eu',
    to: `127.0.0.1:${PORT}`,
    subdomain: LOCALXPOSE_SUBDOMAIN,
    //basicAuth: 'user:pass'
})

let serverUrl: string = ''

export const SERVER_URL_OPTION = process.env.npm_config_server!

export const publicUrl = async(server?: string) => {
    if (!IN_PROD) {
        if (serverUrl.length > 0) {
            console.log(`s ${serverUrl}`)
            return serverUrl
        } else {
            if (server == 'n') {
                serverUrl = String(NGROK_URL)
    
                return serverUrl
            } else if (server == 'l') {
                await LOCALXPOSE_URL
                .then((hlsTunnel: any) => {
                    serverUrl = 'https://' + hlsTunnel.addr
        
                    //console.log(hlsTunnel)
                })
                .catch((err: any) => {
                    console.log(`LocalXpose: ${err.msg}`)
                })
        
                //console.log(serverUrl)
        
                return serverUrl
            } else {
                return 'No server specified, or not valid'
            }
        }
    } else {
        return 'Development servers are not available, node environment is not on development'
    }
}

export const disconnectServer = async() => {
    if (SERVER_URL_OPTION == 'n') {
        await ngrok.kill()

        console.log('Ngrok tunnel stopped')
    } else if (SERVER_URL_OPTION == 'l') {
        await client.kill()

        console.log('LocalXpose tunnel stopped')
    } else {
        console.log('Node not running on development')
    }
}