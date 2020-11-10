import { Client } from '@typeit/discord';
import dotenv from 'dotenv'

dotenv.config()

export async function startDiscordApp() {
    const client = new Client({
        classes: [
            `${__dirname}/*.ts`, // glob string to load the classes
        ],
        silent: false,
        variablesChar: ':'
    });

    await client.login(process.env.DISCORD_BOT_TOKEN!)

    await client.user!.setPresence({
        status: "online",
        activity: {
            name: "!help",
            type: "PLAYING"
        }
    })
}