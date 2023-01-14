import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "users";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string("code").nullable().after("avatar");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
