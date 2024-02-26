import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()

      // Global authentification fields
      table.string('email', 254).notNullable()
      table.string('password').nullable()

      // Name
      table.string('username').notNullable()
      table.string('display_name').nullable()
      table.string('avatar_url').nullable()

      // Social authentification fields
      table.string('social_type').nullable()
      table.string('social_id').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
    this.schema.alterTable(this.tableName, (table) => {
      table.unique(['email', 'social_type'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
