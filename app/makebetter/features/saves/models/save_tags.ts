import Tag from '#tags/models/tag'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import ToolSave from './save.js'

export default class ToolSaveTag extends BaseModel {
  @column({ isPrimary: true })
  declare saveId: number

  @column({ isPrimary: true })
  declare tagId: number

  @belongsTo(() => ToolSave, {
    localKey: 'saveId',
    foreignKey: 'id',
  })
  declare makebetterSave: BelongsTo<typeof ToolSave>

  @belongsTo(() => Tag, {
    localKey: 'tagId',
    foreignKey: 'id',
  })
  declare tag: BelongsTo<typeof Tag>

  static get table() {
    return 'mb_tool_saves_tags'
  }
}
