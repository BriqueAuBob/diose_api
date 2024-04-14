import { DateTime } from 'luxon'
import { withAuthFinder } from '@adonisjs/auth'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Social from './social.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email', 'username'],
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

  @hasMany(() => Social)
  declare socials: HasMany<typeof Social>

  @column()
  declare email: string

  @column({
    serializeAs: null,
  })
  declare password?: string

  @column.dateTime()
  declare bannedAt?: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days',
  })

  static resetPasswordTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '1h',
    type: 'reset-password',
    prefix: 'drp_',
  })

  static temporaryTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '1m',
    type: 'temporary-auth',
    prefix: 'dta_',
  })
}
