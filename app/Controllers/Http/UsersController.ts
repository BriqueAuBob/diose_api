// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Config from '@ioc:Adonis/Core/Config';
import User from 'App/Models/User';
import axios from 'axios';

export default class UsersController {
    async index({ request }) {
        const users = await User.query()
            .preload('roles')
            .where('username', 'LIKE', '%' + request.input('search') + '%')
            .orWhere('discord_id', 'LIKE', '%' + request.input('search') + '%')
            .paginate(request.input('page'), 20);

        return {
            success: true,
            meta: users.getMeta(),
            users: users.toJSON().data,
        };
    }

    async show({ request }) {
        const user = await User.find(request.param('id'));
        return {
            success: true,
            user: user?.$original,
        };
    }

    async refetchAvatar({ request }) {
        const user = await User.find(request.param('id'));
        if (user) {
            const { data } = await axios.get('https://discord.com/api/users/' + user.discord_id, {
                headers: {
                    Authorization: 'Bot ' + Config.get('discord.BOT_TOKEN'),
                },
            });
            user.avatar = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`;
            user.save();
        }
        return {
            success: true,
            user: user?.$attributes,
        };
    }
}
