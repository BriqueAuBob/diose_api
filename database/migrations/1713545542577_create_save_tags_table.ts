import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'mb_tool_saves_tags'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigInteger('save_id').unsigned().references('mb_tool_saves.id').onDelete('CASCADE')
      table.bigInteger('tag_id').unsigned().references('tags.id').onDelete('CASCADE')
      table.primary(['save_id', 'tag_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
