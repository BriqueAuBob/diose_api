import axios from 'axios';
import Config from '@ioc:Adonis/Core/Config';

export default class DiscordChannelController {
    async show({ request }) {
        try {
            const { data } = await axios.get(`https://discord.com/api/v10/channels/${request.param('id')}`, {
                headers: {
                    Authorization: 'Bot ' + Config.get('discord.BOT_TOKEN_MB'),
                },
            });

            return {
                channel: {
                    type: data.type,
                    name: data.name,
                },
            };
        } catch (error) {
            console.log(error);
            return {
                channel: null,
            };
        }
    }
}
