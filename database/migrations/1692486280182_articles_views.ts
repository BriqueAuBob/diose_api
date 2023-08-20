import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
    protected tableName = 'articles_views';

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.integer('article_id').unsigned().references('id').inTable('articles').onDelete('CASCADE');
            table.integer('user_id').nullable().unsigned().references('id').inTable('users');
            table.string('ip_address', 45).nullable();
            /**
             * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
             */
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }

    public async down() {
        this.schema.dropTable(this.tableName);
    }
}
