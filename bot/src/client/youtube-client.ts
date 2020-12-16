import { google } from 'googleapis'
import { YOUTUBE_API_KEY } from '../config';

/**
 * Creates a YouTube Client for the YouTube Data API
 */
export const youtube = google.youtube({
    version: 'v3',
    auth: YOUTUBE_API_KEY
});