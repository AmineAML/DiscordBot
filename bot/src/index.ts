import mongoose from 'mongoose'
import { start } from './bot';
import { MONGO_URI, MONGO_OPTIONS} from './config'

;(async () => {
    console.log(`connected to MongoDB => ${MONGO_URI}`)

    await mongoose.connect(MONGO_URI, MONGO_OPTIONS)

    start()
})()