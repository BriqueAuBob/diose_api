import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
    protected tableName = 'articles';

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('title_fr', 80).notNullable();
            table.string('title_en', 80).notNullable();
            table.string('description_fr', 255).notNullable();
            table.string('description_en', 255).notNullable();
            table.string('slug_fr', 255).notNullable();
            table.string('slug_en', 255).notNullable();
            table.text('content_fr', 'longtext').notNullable();
            table.text('content_en', 'longtext').notNullable();
            table.string('image_fr', 255).nullable();
            table.string('image_en', 255).nullable();
            table.boolean('is_published').defaultTo(false);
            table.integer('type').nullable();
            table.integer('author_id').unsigned().references('id').inTable('users');
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });

            table.unique(['slug_fr', 'slug_en']);
        });
    }

    public async down() {
        this.schema.dropTable(this.tableName);
    }
}
