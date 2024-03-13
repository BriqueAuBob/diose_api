import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'partners'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('project_id').nullable().unsigned().references('id').inTable('projects')
      table.string('name').notNullable()
      table.string('description').nullable()
      table.string('logo_url').notNullable()
      table.string('website_url').nullable()
      table.boolean('is_visible').defaultTo(false)
      table.datetime('date_start').nullable().defaultTo(this.now())
      table.datetime('date_end').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
