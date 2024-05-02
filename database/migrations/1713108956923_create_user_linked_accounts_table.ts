import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_linked_accounts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('provider').notNullable()
      table.string('social_id').notNullable()
      table.bigInteger('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('token_type').nullable().defaultTo('Bearer')
      table.text('access_token').nullable()
      table.text('refresh_token').nullable()
      table.timestamp('expires_at').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.unique(['provider', 'social_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
