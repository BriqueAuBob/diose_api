import { BaseModel, column } from '@adonisjs/lucid/orm'
import translatable from '#core/decorators/translatable'
import { DateTime } from 'luxon'

export default class Tag extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @translatable()
  declare name: {
    [key: string]: string
  }

  @column()
  declare color: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
