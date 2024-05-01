import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Translation extends BaseModel {
  @column({
    isPrimary: true,
  })
  declare inTable: string

  @column({
    isPrimary: true,
  })
  declare recordId: number

  @column({
    isPrimary: true,
  })
  declare field: string

  @column({
    isPrimary: true,
  })
  declare locale: string

  @column()
  declare value: string
}
