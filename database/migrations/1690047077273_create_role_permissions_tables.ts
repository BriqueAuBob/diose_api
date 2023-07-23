import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "roles_permissions";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer("role_id")
        .unsigned()
        .references("id")
        .inTable("roles")
        .onDelete("CASCADE");
      table
        .integer("permission_id")
        .unsigned()
        .references("id")
        .inTable("permissions")
        .onDelete("CASCADE");

      table.primary(["role_id", "permission_id"]);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
