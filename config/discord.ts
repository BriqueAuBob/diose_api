import env from '#start/env'
import { Secret } from '@adonisjs/core/helpers'

const discordConfig = {
  tokens: {
    diose: new Secret(env.get('DISCORD_BOT_TOKEN_DIOSE')),
    makebetter: new Secret(env.get('DISCORD_BOT_TOKEN_MAKEBETTER')),
  },
}

export default discordConfig
