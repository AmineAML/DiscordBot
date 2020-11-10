import { google } from 'googleapis'
import dotenv from 'dotenv'

dotenv.config()

const {
    YOUTUBE_API_KEY
} = process.env

/**
 * Creates a YouTube Client for the YouTube Data API
 */
export const youtube = google.youtube({
    version: 'v3',
    auth: YOUTUBE_API_KEY
});