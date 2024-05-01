import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ToolSaveTag extends BaseModel {
  @column({ isPrimary: true })
  declare saveId: number

  @column({ isPrimary: true })
  declare tagId: number

  static get table() {
    return 'mb_tool_saves_tags'
  }
}
