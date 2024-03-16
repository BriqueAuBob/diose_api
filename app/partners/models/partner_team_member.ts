import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Partner from './partner.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '../../auth/models/user.js'

export default class PartnerTeamMember extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @belongsTo(() => Partner, {
    foreignKey: 'partnerId',
  })
  declare partnerId: BelongsTo<typeof Partner>

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare userId: BelongsTo<typeof User>

  @column()
  declare role: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
