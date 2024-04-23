import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'translations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('in_table').nullable()
      table.string('field').notNullable()
      table.string('locale').notNullable()
      table.string('value').notNullable()

      table.primary(['in_table', 'field', 'locale'])
      table.unique(['in_table', 'field', 'locale'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
