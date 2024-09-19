import { BaseModel, belongsTo, column, hasMany, hasManyThrough } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import ToolSaveTag from './save_tags.js'
import type { BelongsTo, HasMany, HasManyThrough } from '@adonisjs/lucid/types/relations'
import Tag from '#tags/models/tag'
import User from '#users/models/user'
import ToolSaveMember from './save_member.js'

export default class ToolSave extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare authorId: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column({
    consume: (value: string) => value,
    prepare: (value: JSON) => JSON.stringify(value),
  })
  declare data: JSON

  @column()
  declare isVerified: boolean

  @column()
  declare type: string

  @column()
  declare isPublic: boolean

  @hasManyThrough([() => Tag, () => ToolSaveTag], {
    localKey: 'id',
    foreignKey: 'saveId',
    throughLocalKey: 'tagId',
    throughForeignKey: 'id',
  })
  declare tags: HasManyThrough<typeof Tag>

  @belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'authorId',
  })
  declare author: BelongsTo<typeof User>

  @hasMany(() => ToolSaveMember, {
    localKey: 'id',
    foreignKey: 'saveId',
    onQuery: (query) => query.preload('user'),
  })
  declare members: HasMany<typeof ToolSaveMember>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static get table() {
    return 'mb_tool_saves'
  }
}
