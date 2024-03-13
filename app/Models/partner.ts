import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import PartnerTeamMember from './partner_team_member.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Partner extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare logo_url: string

  @column()
  declare website_url: string

  @column()
  declare is_visible: boolean

  @hasMany(() => PartnerTeamMember, {
    foreignKey: 'partnerId',
  })
  declare members: HasMany<typeof PartnerTeamMember>

  @column.dateTime()
  declare date_start: DateTime

  @column.dateTime()
  declare date_end: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
