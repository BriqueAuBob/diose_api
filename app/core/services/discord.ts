import { Secret } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10'

const tokens = app.config.get<{ [key: string]: Secret<string> }>('discord.tokens')
const bots = {
  diose: new REST({ version: '10' }).setToken(tokens?.diose?.release()),
  makebetter: new REST({ version: '10' }).setToken(tokens?.makebetter?.release()),
}
export { bots as default, Routes }
