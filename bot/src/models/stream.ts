import { Schema, model, Document } from 'mongoose'

//Useful that the bot verifies each 20 minutes that the channel's live streaming, if it's, the bot doesn't notify again about the same channel the same day
interface StreamDocument extends Document {
    channelId: string,
    stream: Date
}

const streamSchema = new Schema({
    channelId: String,
    stream: Date,
})

export const Stream = model<StreamDocument>('Stream', streamSchema)