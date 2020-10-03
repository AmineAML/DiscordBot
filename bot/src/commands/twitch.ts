import { CommandMessage, Command, Description } from '@typeit/discord'
import { Channel, TwitchArgs } from '../models'
import { streamersen, streaming } from '../services/command-service'
import * as TwitchService from '../services/twitch-service'

export abstract class TwitchDiscordCommands {
    @Command("add :channelName")
    @Description("Add a channel to the live streaming notification list")
    async channel(command: CommandMessage<TwitchArgs>) {
        command.channel.startTyping()

        const { channelName } = command.args

        //Save into database channel name
        const found = await Channel.exists({ channelName })

        if (found) {
            command.channel.send(`You've already added ${channelName} to your bot`)
        } else {
            const cnlExist = await TwitchService.getChannel(channelName)

            if (cnlExist.data[0]) {
                const cnl = await Channel.create({
                    channelName
                })
    
                command.channel.send(`${cnlExist.data[0].display_name} is addded`)
            } else {
                command.channel.send(`No Twitch channel name exist with this name ${channelName}`)
            }
        }

        command.channel.stopTyping()
    }

    @Command("remove :channelName")
    @Description("Remove a channel from the live streaming notification list")
    async remove(command: CommandMessage<TwitchArgs>) {
        command.channel.startTyping()

        const { channelName } = command.args

        const found = await Channel.exists({ channelName })

        if (!found) {
            command.channel.send(`${channelName} does not exist, you've added it. You can added by using the command: !add channelName`)
        } else {
            const cnl = await Channel.deleteOne({
                channelName
            })

            if (cnl.deletedCount! > 0) {
                command.channel.send(`${channelName} was deleted`)
            }
        }

        command.channel.stopTyping
    }

    @Command("streaming")
    @Description("List of channels that are live streaming")
    async streamers(command: CommandMessage) {
        command.channel.startTyping()

        //Load all channels' names from the database
        const streamers = await streamersen()

        let t, c;

        //Found a channel or more saved in the database
        if (streamers.length > 0) {
            //Plural and singular
            await streamers.length == 1 ? t = "This"  : t = "These"
            await streamers.length == 1 ? c = "channel"  : c = "channels"

            const streamings = await streaming(streamers)

            if (streamings.length > 0) {
                command.channel.send(`${t} twitch ${c} are live streaming:\n${streamings}`)
            } else {
                command.channel.send('No Twitch channels are streaming')
            }
        } 
        //Found no channels saved in the database
        else {
            command.channel.send('No Twitch channels added to the bot')
        }

        command.channel.stopTyping()
    }

    @Command("channels")
    @Description("List of channels that are added to the notifications of live streaming")
    async channels(command: CommandMessage) {
        command.channel.startTyping()

        //Load all channels' names from the database
        const streamers = await streamersen()

        //Found a channel or more saved in the database
        if (streamers.length > 0) {
            command.channel.send(`Twitch channels:\n${streamers.join('\n')}`)
        }
        //Found no channels saved in the database
        else {
            command.channel.send('No Twitch channels added to the bot')
        }

        command.channel.stopTyping()
    }
}