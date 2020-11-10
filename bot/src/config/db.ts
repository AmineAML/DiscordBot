import { ConnectionOptions } from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOST,
    MONGO_PORT,
    MONGO_DATABASE
} = process.env

export const MONGO_URI = `mongodb://${MONGO_USERNAME}:${encodeURIComponent(MONGO_PASSWORD!)}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}` //The encodeURIComponent's used to escape no alpha numerical characters

export const MONGO_OPTIONS: ConnectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}