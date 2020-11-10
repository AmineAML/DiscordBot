<h1 align="center">Discord Bot</h1>

Discord bot which performs auto moderation and notify about Twitch and YouTube channels that are live streaming. Bot can do a basic conversation. By using [NLP.js](https://github.com/axa-group/nlp.js), the bot can guess the language (currently English and French) and react to the user's message by a '👍' for positivity and '👎' for negativity. User can add/remove Twitch and YouTube channels to/from the notification list, also retrieve them and display those who are live streaming

## Features and commands
<img src="bot\assets\pictures\Bot.png">

## Getting started

### Prerequisites
Make sure you have installed all of this prerequisites
- Git - [Download and install Git](https://git-scm.com/downloads)
- Node.js - [Download and install Node.js](https://nodejs.org/en/download/) which does also install NPM with it
- Docker - [Download and install Docker](https://www.docker.com/get-started)


### Installation
1. Clone the repo ```git clone https://github.com/AmineAML/DiscordBot.git```
2. Install NPM packages ```npm install```
3. Rename `.env.example` file to `.env`
4. [Register your app](https://dev.twitch.tv/console/apps) and copy/paste the Client ID and Client Secret into `.env` file replacing their default values of TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET
5. Generate an [Oauth]((http://twitchapps.com/tmi/)) and copy/paste it into `.env` file replacing the default value of TWITCH_OAUTH_TOKEN
6. You either use one of the following
    - Sign up a new account or login into [ngrok.com](https://ngrok.com/), you should obtain your AuthToken from the authentication tab of the dashboard, copy/paste it into `.env` file replacing the default value of NGROK_AUTHTOKEN
    - Sign up a new account or login into [LocalXpose](https://localxpose.io/), you should obtain your access token from the acces tab of the dashboard, copy/paste it into `.env` file replacing the default value of LOCALXPOSE_ACCESS_TOKEN. And do modify the subdomain.
7. Follow this [quickstart](https://developers.google.com/youtube/v3/quickstart/nodejs) to get your YouTube Data API key, you don't have to do all of those steps, generate an API key and copy/paste it into `.env` file replacing the default value of YOUTUBE_API_KEY
8. Follow these steps to [Set up a bot](https://discordjs.guide/preparations/setting-up-a-bot-application.html) and copy/paste your Discord bot token into `.env` file replacing the default value of DISCORD_BOT_TOKEN
9. [Add the bot to a server](https://discordjs.guide/preparations/adding-your-bot-to-servers.html)

#### Webhooks
- Enable you to subscribe to events, which when an event you subscribed to occurs, you're notified [1](https://dev.twitch.tv/docs/api/webhooks-guide#introduction). [Discord.js](https://discord.js.org/) implements a variety of methods of working with webhooks [2](https://discordjs.guide/popular-topics/webhooks.html#webhooks). 
- Use this [doc](https://discordjs.guide/popular-topics/webhooks.html#creating-webhooks-through-server-settings) for how to get your webhook url for a channel in your server, and copy/paste into `.env` file replacing the default value of DISCORD_CHANNEL_WEBHOOK
- By subscribing to webhook of a Twitch channel, the Twitch API sends a notification to our server whenever that channel's live streaming. This option's using [ngrok](https://ngrok.com/) which generates a public URL to your localhost server, this URL's auto generated and constantly changes with each rebuild (although there's a paid plan with a constant URL). For production you can use your own domain by replacing the default value from `.env`of TWITCH_HUB_CALLBACK with it.
- Part of the previous option, you can also use [LocalXpose](https://localxpose.io/) as an alternative to ngrok. The difference is that you can specify a custom subdomain to the public URL (or it also does generate it randomly), which's a better use case with the Twitch API as you can use the same public URL, but keep in mind that it does hold it for 15 mins after you're not using it, meaning that others could specify the same subdomain, that's why it's better to use a long string subdomain like a long word or a combination of words specific to your project (both ngrok and LocalXpose come with paid plans which allow you to reserve a subdomain or use your own domain).

##### Optional
- An easy way to get started with webhooks without using a bot, is by making use of [IFTTT](https://ifttt.com), you can follow this [gist by smiley](https://gist.github.com/smiley/78c1c2a57d17a179a978a1438b389710) which goes into details of integrating a webhook which triggers a Disocrd notification. Keep in mind that this is specific to when your channel goes live, if you're like me insterested to trigger notifications of other Twitch channels that you follow going live, in [step 4 of part 3](https://gist.github.com/smiley/78c1c2a57d17a179a978a1438b389710#part-3---create-a-new-ifttt-appletrecipe) from the same gist choose "Stream going live for a channel you follow" rather than the option listed there (by using this option you limit yourself to only Twitch channels that you follow with your own account).

### Usage
For development, specify which public URL tunnel you want to use
* Running with ngrok
    - ```npm run up --server=n```
* Running with LocalXpose
    - ```npm run up --server=l```
* A notification will ask you if you want to share `mongo-init.sh` file with Docker. Accept it

## Docs
- [Twitch API](https://dev.twitch.tv/docs/)
- [Discord.ts repo and docs](https://github.com/OwenCalvin/discord.ts)
- [Discord.js docs](https://discordjs.guide/#before-you-begin) and also [Discord.js docs](https://discord.js.org/#/docs/main/stable/general/welcome)

## License
[MIT](https://github.com/AmineAML/DiscordBot/blob/main/LICENSE)