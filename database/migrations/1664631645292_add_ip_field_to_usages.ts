import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
    protected tableName = 'usages';

    public async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.string('ip').after('tool');
        });
    }

    public async down() {
        this.schema.dropTable(this.tableName);
    }
}
