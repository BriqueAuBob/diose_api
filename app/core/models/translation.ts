import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Translation extends BaseModel {
  @column()
  declare inTable: string

  @column()
  declare field: string

  @column()
  declare locale: string

  @column()
  declare value: string
}
