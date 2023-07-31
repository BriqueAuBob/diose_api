import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
    protected tableName = 'users_roles';

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('CASCADE');
            table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');

            table.primary(['role_id', 'user_id']);
        });
    }

    public async down() {
        this.schema.dropTable(this.tableName);
    }
}
