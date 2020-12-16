import { Client } from '@typeit/discord';
import { DISCORD_BOT_TOKEN } from './config';

export async function startDiscordApp() {
    const client = new Client({
        classes: [
            `${__dirname}/*.ts`, // glob string to load the classes
            `${__dirname}/*.js` // If you compile your bot, the file extension will be .js
        ],
        silent: false,
        variablesChar: ':'
    });

    await client.login(DISCORD_BOT_TOKEN!)

    await client.user!.setPresence({
        status: "online",
        activity: {
            name: "!help",
            type: "PLAYING"
        }
    })
}