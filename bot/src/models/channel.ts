import { Schema, model, Document } from 'mongoose'

interface ChannelDocument extends Document {
    channelName: string
}

const channelSchema = new Schema({
    channelName: String,
}, {
    timestamps: true
})

export const Channel = model<ChannelDocument>('Channel', channelSchema)