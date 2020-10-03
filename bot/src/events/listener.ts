import { On } from '@typeit/discord'
import { botCommands } from '../services/command-service'

export abstract class listener {
    @On("ready")
    async onReady(): Promise<void> {
        console.log(`Bot connected, commands list:\n${await botCommands()}`)
    }
}