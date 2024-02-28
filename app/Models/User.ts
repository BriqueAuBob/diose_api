import { DateTime } from 'luxon'
import { withAuthFinder } from '@adonisjs/auth'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string

  @column({
    serialize: (value, _, model) => {
      return value || model.$original.username
    },
  })
  declare displayName?: string

  @column({
    serialize: (value, _, model) => {
      switch (model.$original.socialType) {
        case 'discord':
          return (
            'https://cdn.discordapp.com/avatars/' + model.$original.socialId + '/' + value + '.png'
          )
        default:
          return value
      }
    },
  })
  declare avatarUrl?: string

  @column()
  declare socialType?: string

  @column()
  declare socialId?: string

  @column()
  declare email: string

  @column({
    serializeAs: null,
  })
  declare password?: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
