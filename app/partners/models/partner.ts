import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import PartnerTeamMember from './partner_team_member.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Project from '#projects/models/project'

export default class Partner extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare projectId: number | null

  @belongsTo(() => Project, {
    foreignKey: 'projectId',
  })
  declare project: BelongsTo<typeof Project>

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare logoUrl: string

  @column()
  declare websiteUrl: string

  @column()
  declare isVisible: boolean

  @hasMany(() => PartnerTeamMember, {
    foreignKey: 'partnerId',
  })
  declare members: HasMany<typeof PartnerTeamMember>

  @column.dateTime()
  declare dateStart: DateTime

  @column.dateTime()
  declare dateEnd: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
