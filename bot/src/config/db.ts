import { ConnectionOptions } from 'mongoose'
import { IN_PROD } from './app'
import { MONGODB_PRODUCTION_URL, MONGO_DATABASE, MONGO_HOST, MONGO_PASSWORD, MONGO_PORT, MONGO_USERNAME } from './env'

let url

if (IN_PROD) {
    url = MONGODB_PRODUCTION_URL!
} else {
    url = `mongodb://${MONGO_USERNAME}:${encodeURIComponent(MONGO_PASSWORD!)}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}` //The encodeURIComponent's used to escape no alpha numerical characters
}

export const MONGO_URI = url

export const MONGO_OPTIONS: ConnectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}