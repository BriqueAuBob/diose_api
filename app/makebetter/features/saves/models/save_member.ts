import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import ToolSave from './save.js'
import User from '#users/models/user'

export default class ToolSaveMember extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare saveId: number

  @column()
  declare userId: number

  @belongsTo(() => ToolSave, {
    localKey: 'saveId',
    foreignKey: 'id',
  })
  declare makebetterSave: BelongsTo<typeof ToolSave>

  @belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  @column()
  declare role: 'edit' | 'view'

  static get table() {
    return 'mb_tool_saves_members'
  }
}
