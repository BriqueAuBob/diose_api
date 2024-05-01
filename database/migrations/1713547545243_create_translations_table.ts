import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'translations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('locale').notNullable()
      table.string('in_table').nullable()
      table.bigInteger('record_id').unsigned().nullable()
      table.string('field').notNullable()
      table.string('value').notNullable()

      table.primary(['in_table', 'field', 'locale', 'record_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
