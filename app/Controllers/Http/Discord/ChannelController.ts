import axios from 'axios';

export default class DiscordChannelController {
    async show() {
        axios
            .get('https://discord.com/api/v8/channels/1234567890', {
                headers: {
                    Authorization: 'Bot ' + process.env.DISCORD_BOT_TOKEN,
                },
            })
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }
}
