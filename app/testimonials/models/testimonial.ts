import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '../../auth/models/user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Project from '../../projects/models/project.js'

export default class Testimonial extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ serializeAs: null })
  declare authorId: number

  @belongsTo(() => User, {
    foreignKey: 'authorId',
  })
  declare author: BelongsTo<typeof User>

  @column({ serializeAs: null })
  declare projectId: number

  @belongsTo(() => Project, {
    foreignKey: 'projectId',
  })
  declare project: BelongsTo<typeof Project>

  @column()
  declare content: string

  @column()
  declare stars: number

  @column()
  declare isVisible: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
