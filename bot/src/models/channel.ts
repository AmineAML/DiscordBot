import { Schema, model, Document } from 'mongoose'

interface ChannelDocument extends Document {
    channelName: string,
    channelId: string,
    webhook: boolean,
    expiration: Date,
    resubscribed: Date,
    type: string
}

const channelSchema = new Schema({
    channelName: String,
    channelId: String,
    webhook: Boolean,
    expiration: Date,
    resubscribed: Date,
    type: String,
})

export const Channel = model<ChannelDocument>('Channel', channelSchema)