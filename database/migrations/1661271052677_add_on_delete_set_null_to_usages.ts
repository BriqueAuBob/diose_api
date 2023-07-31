import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
    protected tableName = 'usages';

    public async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropForeign('user_id');
            table.integer('user_id').unsigned().references('id').inTable('users').onDelete('set null').alter();
        });
    }

    public async down() {
        this.schema.dropTable(this.tableName);
    }
}
