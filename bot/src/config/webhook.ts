import { WebhookClient } from 'discord.js'
import { DISCORD_CHANNEL_WEBHOOK } from './env'

const webhook_id = DISCORD_CHANNEL_WEBHOOK !== undefined ? DISCORD_CHANNEL_WEBHOOK!.split("/")[5] : undefined

const webhook_token= DISCORD_CHANNEL_WEBHOOK !== undefined ? DISCORD_CHANNEL_WEBHOOK!.split("/")[6]: undefined

console.log({ webhook_id, webhook_token })

export const hook = webhook_id && webhook_token ? new WebhookClient(webhook_id, webhook_token) : false