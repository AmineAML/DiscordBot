import { On, ArgsOf, Client } from '@typeit/discord'  
import { botCommands, webhookConfirmChannelById, webhookResubscriptionsManagement, youtuberLiveStreaming } from '../utils'
import express from 'express'
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors'
import { hook, port } from '../config'

export abstract class listener {
  @On("ready")
  private async onReady(
    [message]: ArgsOf<"message">,
    client: Client
  ) {
    console.log(`Bot connected, commands list:\n${await botCommands()}`)

    const app = express()

    //Define various HTTP headers that help secure the API 
    app.use(helmet())

    //Logging
    app.use(morgan('tiny'))

    //Add headers accepting requests coming from other origins
    app.use(cors())

    app.use(express.json())

    // DEPRECATED as of Twitch has depracated the webhook subscriptions in favor of eventsub subscriptions
    //Twitch request this route to verify that the server is working geniuly
    app.get('/twitchwebhookcallback', async (req, res) => {
      const challengeToken = req.query['hub.challenge']

      const reasonToken = req.query['hub.reason']

      res.format({
        'text/plain': async function () {
          if (challengeToken !== undefined) {
            console.log(challengeToken)

            //const hubTopicExample = 'https://api.twitch.tv/helix/streams?user_id=67852884'

            //Adding a new Twitch channel it's important to verify that the Twitch API accepted the webhook subscription, thus awaiting the response from the Twitch API
            const userId = req.query['hub.topic']!.toString().split("=")[1]

            console.log(userId)

            await webhookConfirmChannelById(userId)

            res.send(challengeToken)
          }
          if (reasonToken !== undefined) {
            console.log(reasonToken)

            res.end()
          }
        }
      })
    })

    app.post('/twitchwebhookcallback', async (req, res) => {
      try {
        const b = req.body

        console.log(b)

        if (b && b['challenge']) {
          const userId = b.subscription.condition.broadcaster_user_id

          console.log(userId)

          await webhookConfirmChannelById(userId)

          return res.send(b['challenge'])
        }

        if (b) {
          // hook !== false ? hook.send(`@everyone ${data[0].user_name} is live streaming! Here's a link: https://www.twitch.tv/${data[0].user_name.toLowerCase()}`) : ''
          if (hook !== false) hook.send(`@everyone ${b.event.broadcaster_user_name} is live streaming! Here's a link: https://www.twitch.tv/${b.event.broadcaster_user_name.toLowerCase()}`)
        }
      } catch (error) {
        console.log(error)
      }

      res.send({ message: 'OK' })
    })

    //Useful with development using ngrok and/or LocalXpose to verify it's working
    app.get('/devpuburl', async (req, res) => {
      res.send({ message: 'OK' })
    })

    app.listen(port, () => console.log(`🚀 => http://localhost:${port}`))

    webhookResubscriptionsManagement()

    youtuberLiveStreaming()

    //TODO: Verify that there's a philosophie and positivity channel, else make them part of the bruhbot category
  }
}