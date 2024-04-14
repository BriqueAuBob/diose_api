import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Social extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare provider: string

  @column()
  declare socialId: string

  @column()
  declare userId: number

  @column()
  declare accessToken: string

  @column()
  declare refreshToken: string

  @column()
  declare tokenType: string

  @column.dateTime()
  declare expiresAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static get table() {
    return 'user_linked_accounts'
  }
}
