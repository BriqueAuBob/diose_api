import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
    protected tableName = 'tags';

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('name', 30).notNullable();
            table.string('bg_color', 7).notNullable();
            table.string('text_color', 7).notNullable();
            /**
             * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
             */
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });

            table.unique(['name']);
        });
    }

    public async down() {
        this.schema.dropTable(this.tableName);
    }
}
