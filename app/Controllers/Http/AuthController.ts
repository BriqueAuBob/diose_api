import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import User from 'App/Models/User';
import axios from 'axios';
import Config from '@ioc:Adonis/Core/Config';

export default class AuthController {
    public async redirect({ ally, request }: HttpContextContract) {
        let redirect = await ally.use(request.param('provider')).redirectUrl();
        return {
            success: true,
            redirect,
        };
    }

    public async authorize({ ally, request, auth }: HttpContextContract) {
        const provider = await ally.use(request.param('provider'));

        /**
         * User has explicitly denied the login request
         */
        if (provider.accessDenied()) {
            return 'Access was denied';
        }

        /**
         * Unable to verify the CSRF state
         */
        if (provider.stateMisMatch()) {
            return 'Request expired. Retry again';
        }

        /**
         * There was an unknown error during the redirect
         */
        if (provider.hasError()) {
            return provider.getError();
        }

        try {
            /**
             * Get the user profile from the provider
             */
            const user = await provider.user();

            /**
             * Find or create a user using the provider's user id
             */
            const dbUser = await User.updateOrCreate(
                {
                    discord_id: user.id,
                },
                {
                    discord_id: user.id,
                    email: user.email,
                    username: user.nickName,
                    discriminator: user.original.discriminator,
                    avatar: user.avatarUrl,
                },
            );

            const code = Math.random().toString(36).substring(2, 15);
            dbUser.code = code;
            dbUser.save();

            /**
             * Generate token from user
             */
            const token = await auth.use('api').generate(dbUser, {
                expiresIn: '7days',
            });

            /**
             * Get user guilds owned
             */
            const { data } = await axios.get('https://discord.com/api/v10/users/@me/guilds', {
                headers: {
                    Authorization: 'Bearer ' + user.token.token,
                },
            });

            const guilds = data.filter((guild) => guild.owner);
            const guildUMaestro = guilds.find((guild) => guild.id === '977507903307145216');
            try {
                if (!guildUMaestro) {
                    await axios.put(
                        `https://discord.com/api/v10/guilds/977507903307145216/members/${user.id}`,
                        {
                            access_token: user.token.token,
                        },
                        {
                            headers: {
                                Authorization: 'Bot ' + Config.get('discord.BOT_TOKEN'),
                            },
                        },
                    );
                }
            } catch (error) {
                console.log(error);
            }

            return {
                success: true,
                user: dbUser,
                guilds,
                token,
                code,
            };
        } catch (error) {
            console.log(error);
            return {
                success: false,
            };
        }
    }

    private async getUser(user: User) {
        await user?.load('roles');
        return {
            ...user.$original,
            code: undefined,
            roles: user?.roles.map((role) => {
                return {
                    name: role.name,
                    display_name: role.display_name,
                };
            }),
            permissions: user?.getPermissions().map((perm) => {
                return perm.name;
            }),
        };
    }

    public async auth({ auth }) {
        const user = await this.getUser(auth.user);
        return {
            user,
        };
    }

    public async destroy({ auth }) {
        auth.user.delete();
        return {
            success: true,
        };
    }

    public async generateCode({ auth }) {
        const code = Math.random().toString(36).substring(2, 15);
        auth.user.code = code;
        auth.user.save();
        return {
            success: true,
            code,
        };
    }

    public async getAccessToken({ auth, request }) {
        const user = await User.findBy('code', request.qs().code);
        if (user) {
            user.code = null;
            user.save();

            const token = await auth.use('api').generate(user, {
                expiresIn: '7days',
            });

            let userReturn = await this.getUser(user);

            return {
                success: true,
                user: userReturn,
                token,
            };
        } else {
            return {
                success: false,
                message: 'Invalid code',
            };
        }
    }
}
