import Env from '@ioc:Adonis/Core/Env';

export default {
    BOT_TOKEN: Env.get('DISCORD_BOT_TOKEN_UMAESTRO'),
    BOT_TOKEN_MB: Env.get('DISCORD_BOT_TOKEN_MAKEBETTER'),
};
