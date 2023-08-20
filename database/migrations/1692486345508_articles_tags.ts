import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
    protected tableName = 'articles_tags';

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.integer('article_id').unsigned().references('id').inTable('articles').onDelete('CASCADE');
            table.integer('tag_id').unsigned().references('id').inTable('tags').onDelete('CASCADE');
            table.primary(['article_id', 'tag_id']);
        });
    }

    public async down() {
        this.schema.dropTable(this.tableName);
    }
}
