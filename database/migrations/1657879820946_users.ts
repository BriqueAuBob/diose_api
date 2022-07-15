import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.bigInteger('discord_id').notNullable()
      table.string('email').notNullable()
      table.string('username').notNullable()
      table.integer('discriminator').notNullable()
      table.string('avatar').notNullable()
      table.timestamps()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
