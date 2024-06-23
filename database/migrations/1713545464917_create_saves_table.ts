import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'mb_tool_saves'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.bigInteger('author_id').notNullable()
      table.string('name').notNullable()
      table.text('description').nullable()
      table.jsonb('data').notNullable()
      table.string('type').notNullable()
      table.boolean('is_public').notNullable().defaultTo(false)
      table.boolean('is_verified').notNullable().defaultTo(false)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
