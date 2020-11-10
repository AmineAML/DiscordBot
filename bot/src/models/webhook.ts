import { Schema, model, Document } from 'mongoose'

interface WebhookDocument extends Document {
    channelId: string
}

const webhookSchema = new Schema({
    channelId: String,
})

export const WebhookChannelId = model<WebhookDocument>('Webhook', webhookSchema)