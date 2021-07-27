import mongoose from 'mongoose'
import { startDiscordApp } from './bot';
import { revokeAccessToken } from './client/twitch-client';
import { MONGO_URI, MONGO_OPTIONS, publicUrl, SERVER_URL_OPTION, disconnectServer, IN_PROD} from './config'

const beforeShutdown = require('./utils/before-shutdown');

;(async () => {
    await mongoose.connect(MONGO_URI, MONGO_OPTIONS).then(() => {
        console.log(`connected to MongoDB => ${MONGO_URI}`)
    }).catch((err) => {
        console.error(`Couldn't connected to MongoDB\n${err}`)
    })

    startDiscordApp()

    //Specify the server by using npm run up --server=n or npm run up --server=l
    const url = await publicUrl(SERVER_URL_OPTION)

    console.log(`  => ${await url}`)
   
   // Register shutdown callbacks: they will be executed in the order they were provided
   beforeShutdown(() => console.log('beforeShutDown'));
   beforeShutdown(async () => {
       if (IN_PROD) await disconnectServer()
   });
   beforeShutdown(async () => await mongoose.disconnect().then(() => {
       console.log('Disconnected from MongoDB')
   }));
   beforeShutdown(async () => await revokeAccessToken());
})()