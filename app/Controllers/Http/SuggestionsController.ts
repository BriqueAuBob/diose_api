// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios';
import Config from '@ioc:Adonis/Core/Config';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Redis from '@ioc:Adonis/Addons/Redis';

export default class SuggestionsController {
    public async store({ auth, request }) {
        const newSuggestion = schema.create({
            content: schema.string([rules.minLength(20), rules.maxLength(500)]),
        });
        await request.validate({
            schema: newSuggestion,
            messages: {
                required: 'Vous devez indiquer une suggestion.',
                minLength: 'Le contenu de la suggestion dois faire au moins {{ options.minLength }} caractères.',
                maxLength: 'Le contenu de la suggestion dois faire  {{ options.maxLength }} caractères au maximum.',
            },
        });

        const { data } = await axios.post(
            'https://discordapp.com/api/v8/channels/1011729746062737560/messages',
            {
                embeds: [
                    {
                        author: {
                            icon_url: auth.user.avatar,
                            name: 'Suggestion de ' + auth.user.username,
                        },
                        description: request.input('content'),
                        color: 3092790,
                        timestamp: new Date().toISOString(),
                        image: {
                            url: 'https://i.imgur.com/kdJejsd.png',
                        },
                    },
                ],
            },
            {
                headers: {
                    Authorization: 'Bot ' + Config.get('discord.BOT_TOKEN'),
                },
            },
        );

        let suggestions = JSON.parse((await Redis.get('suggestions')) || '[]');
        if (suggestions.length > 0) {
            suggestions.push(data);
            Redis.set('suggestions', JSON.stringify(suggestions), 'EX', 60);
        }
        await axios.put(
            `https://discordapp.com/api/v8/channels/${data.channel_id}/messages/${data.id}/reactions/${encodeURI(
                '✅',
            )}/@me`,
            {},
            {
                headers: {
                    Authorization: 'Bot ' + Config.get('discord.BOT_TOKEN'),
                },
            },
        );
        setTimeout(() => {
            axios.put(
                `https://discordapp.com/api/v8/channels/${data.channel_id}/messages/${data.id}/reactions/${encodeURI(
                    '❌',
                )}/@me`,
                {},
                {
                    headers: {
                        Authorization: 'Bot ' + Config.get('discord.BOT_TOKEN'),
                    },
                },
            );
        }, 1000);

        return {
            success: true,
            message: 'Votre suggestion a bien été publiée.',
        };
    }

    async index() {
        let suggestions = JSON.parse((await Redis.get('suggestions')) || '[]');
        if (suggestions.length <= 0) {
            const { data } = await axios.get('https://discord.com/api/v8/channels/1011729746062737560/messages', {
                headers: {
                    Authorization: 'Bot ' + Config.get('discord.BOT_TOKEN'),
                },
            });
            const messagesSuggestions = data.filter(
                (message) => message.type === 0 && message.embeds[0].author.name !== 'Suggestions',
            );
            await Redis.set('suggestions', JSON.stringify(messagesSuggestions), 'EX', 60);
            suggestions = messagesSuggestions;
        }
        return { success: true, suggestions };
    }
}
