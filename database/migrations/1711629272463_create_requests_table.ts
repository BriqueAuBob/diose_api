import { BaseSchema } from '@adonisjs/lucid/schema'
import RequestStatus from '../../app/requests/enums/status.js'

export default class extends BaseSchema {
  protected tableName = 'requests'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.bigInteger('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('type').notNullable()
      table.integer('status').notNullable().defaultTo(RequestStatus.Pending)
      table.jsonb('data').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
