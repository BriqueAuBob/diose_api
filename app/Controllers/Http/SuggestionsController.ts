// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios';
import Config from '@ioc:Adonis/Core/Config'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class SuggestionsController {
    public async store({ auth, request }) {
        const newSuggestion = schema.create({
            content: schema.string([
                rules.minLength(20),
                rules.maxLength(500)
            ]),
        })
        await request.validate({
            schema: newSuggestion,
            messages: {
                required: 'Vous devez indiquer une suggestion.',
                minLength: 'Le contenu de la suggestion dois faire au moins {{ options.minLength }} caractères.',
                maxLength: 'Le contenu de la suggestion dois faire  {{ options.maxLength }} caractères au maximum.',
            }
        })

        const { data } = await axios.post('https://discordapp.com/api/v8/channels/1011729746062737560/messages', {
            embeds: [{
                author: {
                    icon_url: auth.user.avatar,
                    name: 'Suggestion de ' + auth.user.username
                },
                description: request.input('content'),
                color: 3092790,
                timestamp: new Date().toISOString(),
                image: {
                    url: 'https://i.imgur.com/kdJejsd.png'
                }
            }]
        }, {
            headers: {
                Authorization: 'Bot ' + Config.get('discord.BOT_TOKEN')
            }
        })

        await axios.put(`https://discordapp.com/api/v8/channels/${data.channel_id}/messages/${data.id}/reactions/${encodeURI('✅')}/@me`, {}, {
            headers: {
                Authorization: 'Bot ' + Config.get('discord.BOT_TOKEN')
            }
        })
        setTimeout(() => {
            axios.put(`https://discordapp.com/api/v8/channels/${data.channel_id}/messages/${data.id}/reactions/${encodeURI('❌')}/@me`, {}, {
                headers: {
                    Authorization: 'Bot ' + Config.get('discord.BOT_TOKEN')
                }
            })
        }, 1000)
    } 
}
