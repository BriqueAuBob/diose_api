import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Configuration extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column({
    serialize(value, _, model) {
      if (model.$original.type === 'json') {
        return JSON.parse(value)
      }
      if (model.$original.type === 'boolean') {
        return Boolean(value)
      }
      if (model.$original.type === 'number') {
        return Number(value)
      }
      return value
    },
  })
  declare value: string

  @column()
  declare expose: boolean

  @column()
  declare type: 'json' | 'string' | 'number' | 'boolean'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
