// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from "App/Models/User";
import axios from 'axios';

export default class AuthController {
    public async redirect ({ ally, request }) {
        const redirect = await ally.use(request.param('provider')).redirectUrl();
        return {
            redirect
        }
    }

    public async authorize({ ally, request, auth }) {
        const provider = await ally.use(request.param('provider'))

        /**
         * User has explicitly denied the login request
         */
        if (provider.accessDenied()) {
            return 'Access was denied'
        }

        /**
         * Unable to verify the CSRF state
         */
        if (provider.stateMisMatch()) {
            return 'Request expired. Retry again'
        }

        /**
         * There was an unknown error during the redirect
         */
        if (provider.hasError()) {
            return provider.getError()
        }

        /**
         * Get the user profile from the provider
         */
        const user = await provider.user()

        /**
         * Find or create a user using the provider's user id
         */
        const dbUser = await User.firstOrCreate({
            discord_id: user.id,
        }, {
            discord_id: user.id,
            email: user.email,
            username: user.nickName,
            discriminator: user.original.discriminator,
            avatar: user.avatarUrl,
        })

        /**
         * Generate token from user
         */
        const token = await auth.use('api').generate(dbUser, {
            expiresIn: '7days'
        })

        /**
         * Get user guilds owned
         */
        const { data } = await axios.get('https://discord.com/api/v8/users/@me/guilds', {
            headers: {
                Authorization: 'Bearer ' + user.token.token
            }
        })
        // @ts-ignore
        const guilds = data.filter(guild => guild.owner)

        return {
            user: dbUser,
            guilds,
            token
        }
    }

    public async auth({ auth }) {
        return {
            user: auth.user,
        }
    }
}
