import { Client } from "@typeit/discord"
import { IN_PROD, publicUrl } from '../config'
import dotenv from 'dotenv'

dotenv.config()

/**
 * All bot commands
 * @returns list of bot commands
*/
export const botCommands = async () => {
    let commands: string[] = []
    Client.getCommands().forEach(element => {
        commands.push(`     !${element.commandName}: ${element.description}`)
    })
    return commands.join('\n')
}

/**
 * Wait for x miliseconds
 * @param ms Milliseconds
 * @returns A setTimeout of x milliseconds
 */
export const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Creates two arrays of resolved and rejected elements from a promise
 * @param results Promise resolved with an array of results
 * @returns An array of resolved element
 */
export const r = (results: any) => {
    const success = []
    const failed = []
              
    for (const result of results) {
        if (result.status === 'rejected') { 
            failed.push(result.reason)
            continue 
        }
        if(result.value) {
            success.push(result.value)
        }
    }
    
    //A request or more didn't work
    if (failed.length > 0) {
        console.error(failed)   
    }

    return success
}

/**
 * Verifies node env for is bot on production or development mode, so to assign a public url that external APIs use to connect with the bot
 * @returns Server domain url
 */
export const callbackHubUrl = async () => {
    if (IN_PROD) {
        const { TWITCH_HUB_CALLBACK } = process.env

        const url = TWITCH_HUB_CALLBACK

        return url
    } else {
        const url = await publicUrl()
        
        return url + '/twitchwebhookcallback'
    }
}

/**
 * Convert the time specified to milliseconds
 * @param value Number of time
 * @param unit Hours, minutes or seconds unit
 */
export const milliseconds = (value: number, unit: 'h' | 'm' | 's') => {
    let ms

    unit === 'h' ? ms = value * 60 * 60 * 1000 : (unit === 'm' ? ms = value * 60 * 1000 : ms = value * 1000)

    return ms
}