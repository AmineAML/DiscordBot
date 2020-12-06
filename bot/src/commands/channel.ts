import { CommandMessage, Command, Description, Infos } from '@typeit/discord'
import { Channel, Youtuber } from '../models'
import { ChannelArgs } from '../types'
import { isDevPubUrlWorking, streamersen, streaming, twitchChannelRecommendation, twitchChannelWebhook } from '../utils'
import * as TwitchService from '../services/twitch-service'
import { EXPIRATION_IN_SECONDS, IN_PROD } from '../config'
import moment from 'moment'
import * as YoutubeService from '../services/youtube-service'
import { MessageEmbed } from 'discord.js'

export abstract class TwitchDiscordCommands {
    @Command("add :type :channelName")
    @Infos({ type: "channel" })
    @Description("Add a channel to the live streaming notification list")
    async webhook(command: CommandMessage<ChannelArgs>) {
        command.channel.startTyping()

        const { type } = command.args

        //The default Discord.ts method of destructuring considers whitespaces to differentiate elements, YouTube channels' name are not necessarily without wihtespaces
        let channelName = command.commandContent.substr(6)

        if (IN_PROD) {
            //Verify that the channel name exits in the database
            const found = await Channel.exists({ channelName: channelName.toLowerCase() })

            if (found) {
                command.channel.send(`You've already added ${channelName} to your bot`)
            } else {
                const chnlName = channelName.toLowerCase()

                if (type === "t") {
                    const cnlt = await TwitchService.getChannel(chnlName)
        
                    if (cnlt.data[0].display_name === chnlName) {
                        const channelId: string = cnlt.data[0].id
        
                        const expiration = moment().add(EXPIRATION_IN_SECONDS, 'seconds').toDate()
        
                        //This usefull that it doesn't re subscribe within as an example 1 hour if it already did
                        const resubscribed = moment().toDate()
        
                        console.log(channelId)
        
                        //Webhook subscription
                        const webhook = await twitchChannelWebhook(channelId, chnlName, expiration, resubscribed)
        
                        if (webhook == false) {
                            command.channel.send(`Error adding ${channelName} channel`)
    
                            command.channel.stopTyping()
                        } else {
                            command.channel.send(`${chnlName} is addded`)
            
                            command.channel.stopTyping()
                        }
                    } else {
                        command.channel.send(`No Twitch channel name exist with this name ${channelName}`)
        
                        command.channel.stopTyping()
                    }
                } else if (type === "y") {
                    const data = await YoutubeService.getChannel(chnlName)

                    if (data === false) {
                        command.channel.send(`Error, or no YouTube channel name exist with this name ${channelName}`)
        
                        command.channel.stopTyping()
                    } else {
                        const channelId = data as unknown as string
                        
                        //Placeholder with YouTube
                        const expiration = moment().add(EXPIRATION_IN_SECONDS, 'seconds').toDate()
        
                        //Placeholder with YouTube
                        const resubscribed = moment().toDate()

                        const cnl = await Channel.create({
                            channelName: chnlName,
                            channelId,
                            webhook: true,
                            expiration,
                            resubscribed,
                            type: 'y'
                        })
        
                        if (!cnl) {
                            command.channel.send(`Error adding ${channelName} channel`)
    
                            command.channel.stopTyping()
                        } else {
                            command.channel.send(`${chnlName} is addded`)
            
                            command.channel.stopTyping()
                        }
                    }
                } else {
                    command.channel.send(`Invalid type! specify y for YouTube and t for Twitch`)

                    command.channel.stopTyping()
                }
            }
        } else {
            //Verify that the LocalXpose and/or ngrok tunnel server's running by using axios
            const pubUrlOnline = isDevPubUrlWorking()

            console.log(pubUrlOnline)

            if (pubUrlOnline) {
                //Verify that the channel name exits in the database
                const found = await Channel.exists({ channelName: channelName.toLowerCase() })

                if (found) {
                    command.channel.send(`You've already added ${channelName} to your bot`)
                } else {
                    const chnlName = channelName.toLowerCase()

                    if (type === "t") {
                        const cnlt = await TwitchService.getChannel(chnlName)
        
                        if (cnlt.data[0].display_name === chnlName) {
                            const channelId: string = cnlt.data[0].id
        
                            const expiration = moment().add(EXPIRATION_IN_SECONDS, 'seconds').toDate()
        
                            //This usefull that it doesn't re subscribe within as an example 1 hour if it already did
                            const resubscribed = moment().toDate()
        
                            console.log(channelId)
        
                            //Webhook subscription
                            const webhook = await twitchChannelWebhook(channelId, chnlName, expiration, resubscribed)
        
                            if (webhook == false) {
                                command.channel.send(`Error adding ${channelName} channel`)
    
                                command.channel.stopTyping()
                            } else {
                                command.channel.send(`${chnlName} is addded`)
            
                                command.channel.stopTyping()
                            }
                        } else {
                            command.channel.send(`No Twitch channel name exist with this name ${channelName}`)
        
                            command.channel.stopTyping()
                        }
                    } else if (type === "y") {
                        const data = await YoutubeService.getChannel(channelName)

                        if (data === false) {
                            command.channel.send(`Error, or no YouTube channel name exist with this name ${channelName}`)
            
                            command.channel.stopTyping()
                        } else {
                            const channelId = data as unknown as string
                            
                            //Placeholder with YouTube
                            const expiration: Date = new Date()

                            //Placeholder with YouTube
                            const resubscribed: Date = new Date()
    
                            const cnl = await Channel.create({
                                channelName: chnlName,
                                channelId,
                                webhook: true,
                                expiration,
                                resubscribed,
                                type: 'y'
                            })
            
                            if (!cnl) {
                                command.channel.send(`Error adding ${channelName} channel`)
        
                                command.channel.stopTyping()
                            } else {
                                command.channel.send(`${chnlName} is addded`)
                
                                command.channel.stopTyping()
                            }
                        }
                    } else {
                        command.channel.send(`Invalid type! specify y for YouTube and t for Twitch`)
    
                        command.channel.stopTyping()
                    }
                }
            } else {
                command.channel.send('Development public url not available')

                command.channel.stopTyping()
            }
        }
    }

    @Command("remove :channelName")
    @Infos({ type: "channel" })
    @Description("Remove a channel from the live streaming notification list")
    async remove(command: CommandMessage<ChannelArgs>) {
        command.channel.startTyping()

        //The default Discord.ts method of destructuring considers whitespaces to differentiate elements, YouTube channels' name are not necessarily without wihtespaces
        let channelName = command.commandContent.substr(7)

        if (channelName === undefined) {
            command.channel.send('Specify the channel name you want to remove. You can find a list of all added channels by using the command: !channels')

            command.channel.stopTyping()
        } else {
            channelName = channelName.toLowerCase()
            
            const found = await Channel.findOne({ channelName }).exec()

            if (found == null) {
                command.channel.send(`${channelName} does not exist, you can added by using the command: !add type channelName`)
    
                command.channel.stopTyping()
            } else {
                if (found.type == 't') {
                    const cnl = await Channel.deleteOne({
                        channelName
                    })
        
                    if (cnl.deletedCount! > 0) {
                        //Using ngrok you cannot unsubscribe from webhooks that were made with a different url
                        const webhook = await TwitchService.unsubscribeWebhookChannel(found.channelId)
        
                        //Verify that a webhook unsubscription's accepted
                        if (webhook == 202) {
                            console.log(`Removed webhook subscription of channel name ${channelName}`)
        
                            command.channel.send(`${channelName} was deleted`)
        
                            command.channel.stopTyping()
                        } else {
                            console.log(`Couldn't remove webhook subscription of channel ${channelName}, or you've haven't subscribed to the channel's webhook`)
        
                            command.channel.send(`${channelName} was deleted`)
        
                            command.channel.stopTyping()
                        }
                    } else {
                        command.channel.send(`Couldn't remove the subscription of channel name ${channelName}`)
    
                        command.channel.stopTyping()
                    }
                } else if (found.type == 'y') {
                    const cnl = await Channel.deleteOne({
                        channelName
                    })

                    if (cnl.deletedCount! > 0) {
                        const video = await Youtuber.deleteMany({
                            channelId: found.channelId
                        })

                        if(video.deletedCount! > 0) {
                            command.channel.send(`${channelName} was deleted`)

                            command.channel.stopTyping()
                        } else {
                            console.log(`Couldn't remove video subcriptions on channel name ${channelName}`)

                            command.channel.send(`${channelName} was deleted`)

                            command.channel.stopTyping()
                        }
                    } else {
                        command.channel.send(`Couldn't remove the subscription of channel name ${channelName}`)

                        command.channel.stopTyping()
                    }
                }
            }
        }
    }

    //Twitch channels that are live streaming
    @Command("streaming")
    @Infos({ type: "channel" })
    @Description("List of channels that are live streaming")
    async streamersall(command: CommandMessage) {
        command.channel.startTyping()

        //Load all channels' names from the database
        const streamers = await streamersen(true)

        //Found a channel or more saved in the database
        if (streamers.length > 0) {
            //Plural and singular
            let t, c, a;
            streamers.length == 1 ? t = "This"  : t = "These"
            streamers.length == 1 ? c = "channel"  : c = "channels"
            streamers.length == 1 ? a = "is"  : a = "are"

            const streamings = await streaming(streamers)

            //console.log(streamings)

            if (streamings.length > 0) {
                command.channel.send(`${t} ${c} ${a} live streaming:`)

                streamings.forEach(channel => {
                    const channels = new MessageEmbed()
                    .setColor('#0099ff')
                    .addField(`${channel.channelName}'s live streaming`, `Here's a link: ${channel.channelUrl}` )
                    .setThumbnail(channel.thumbnail)
                    command.channel.send(channels)
                })

                command.channel.stopTyping()
            } else {
                command.channel.send('No channel\'s streaming')

                command.channel.stopTyping()
            }
        } 
        //Found no channel saved in the database
        else {
            command.channel.send('No channel added to the bot')

            command.channel.stopTyping()
        }
    }

    @Command("channels")
    @Infos({ type: "channel" })
    @Description("List of channels that are added to the notifications of live streaming")
    async channels(command: CommandMessage) {
        command.channel.startTyping()

        //Load all channels' names from the database
        const streamers = await streamersen(true)

        let channelNames: string[] = []

        streamers.forEach(streamer => {
            channelNames.push(streamer.channelName)
        })

        //Found a channel or more saved in the database
        if (channelNames.length > 0) {
            command.channel.send(`Channels:\n${channelNames.join('\n')}`)

            command.channel.stopTyping()
        }
        //Found no channel saved in the database
        else {
            command.channel.send('No channel\'s added to the bot')

            command.channel.stopTyping()
        }
    }

    @Command("reco :type :category")
    @Infos({ type: "channel" })
    @Description("Channel suggestion based on category")
    async recommendation(command: CommandMessage<ChannelArgs>) {
        command.channel.startTyping()

        const { type } = command.args

        //The default Discord.ts method of destructuring considers whitespaces to differentiate elements, YouTube channels' name are not necessarily without wihtespaces
        const game = command.commandContent.substr(7)

        if (type == 't') {
            const user = await twitchChannelRecommendation(game)

            if (user !== undefined) {
                const { name, image, description } = user

                const channel = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(name)
                .setURL(`https://www.twitch.tv/${name.toLowerCase()}`)
                .setThumbnail(image)
                .setDescription(description)
                .addField('Add this channel', `"!add t ${name}"` )

                command.channel.send(channel)

                command.channel.stopTyping()
            } else {
                //Either there's no channel from the specified game or there's no game as specified by the user
                command.channel.send(`Couldn't find any Twitch channel from ${game}`)

                command.channel.stopTyping()
            }
        } else if (type == 'y') {
            command.channel.send(`YouTube channel recommendation's not availlable`)

            command.channel.stopTyping()
        } else {
            command.channel.send(`Invalid type: ${type}, specify a valid type of either 't' or 'y'`)

            command.channel.stopTyping()
        }
    }

    @Command("cat")
    @Infos({ type: "channel" })
    @Description("Discover new/other Twitch games/categories")
    async category(command: CommandMessage) {
        command.channel.startTyping()

        console.log(command.guild!.id)

        const games = await TwitchService.games()

        if (games.data.length > 0) {
            const { name, box_art_url } =  games.data[Math.floor(Math.random() * games.data.length)]
            
            const game = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(name)
            .setURL(`https://www.twitch.tv/directory/game/${encodeURIComponent(name)}`)
            .setThumbnail(box_art_url.replace('{width}', '400').replace('{height}', '600'))
            .addField('Channel recommendation', `"!reco t ${name}"` )

            command.channel.send(game)

            command.channel.stopTyping()
        }
    }
}