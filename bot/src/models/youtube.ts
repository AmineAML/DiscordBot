import { Schema, model, Document } from 'mongoose'

interface YoutubeDocument extends Document {
    videoId: string,
    publishedAt: Date,
    channelId: string
}

const youtubeSchema = new Schema({
    videoId: String,
    publishedAt: Date,
    channelId: String,
})

export const Youtuber = model<YoutubeDocument>('Youtube', youtubeSchema)