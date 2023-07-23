import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Role from "App/Models/Role";
import Permission from "App/Models/Permission";

export default class extends BaseSeeder {
  public async run() {
    const roles = [
      {
        name: "admin",
        display_name: "Administrateur",
        permissions: [
          "view:beta",
          "view:dashboard",
          "read:user",
          "edit:user",
          "delete:user",
          "read:roles",
          "edit:roles",
          "delete:roles",
          "read:permissions",
          "edit:permissions",
          "delete:permissions",
          "edit:testimonials",
          "delete:testimonials",
        ],
      },
      {
        name: "team",
        display_name: "Équipe",
        permissions: ["view:beta"],
      },
      {
        name: "redactor",
        display_name: "Rédacteur",
        permissions: ["view:beta", "view:dashboard"],
      },
      {
        name: "beta_access",
        display_name: "Beta Testeur",
        permissions: ["view:beta"],
      },
      {
        name: "user",
        display_name: "Utilisateur",
      },
    ];

    const permissions = [
      {
        name: "view:beta",
        display_name: "Accès à la beta",
      },
      {
        name: "view:dashboard",
        display_name: "Accès au dashboard",
      },
      {
        name: "read:user",
        display_name: "Lire un utilisateur",
      },
      {
        name: "edit:user",
        display_name: "Modifier un utilisateur",
      },
      {
        name: "delete:user",
        display_name: "Supprimer un utilisateur",
      },
      {
        name: "read:roles",
        display_name: "Lire un rôle",
      },
      {
        name: "edit:roles",
        display_name: "Modifier un rôle",
      },
      {
        name: "delete:roles",
        display_name: "Supprimer un rôle",
      },
      {
        name: "read:permissions",
        display_name: "Lire une permission",
      },
      {
        name: "edit:permissions",
        display_name: "Modifier une permission",
      },
      {
        name: "delete:permissions",
        display_name: "Supprimer une permission",
      },
      {
        name: "edit:testimonials",
        display_name: "Modifier un témoignage",
      },
      {
        name: "delete:testimonials",
        display_name: "Supprimer un témoignage",
      },
    ];

    let permissionNameToId = {};
    for (const permission of permissions) {
      const newPermission = new Permission();
      newPermission.name = permission.name;
      newPermission.display_name = permission.display_name;

      await newPermission.save();
      permissionNameToId[permission.name] = newPermission.id;
    }

    for (const role of roles) {
      const newRole = new Role();
      newRole.name = role.name;
      newRole.display_name = role.display_name;
      await newRole.save();

      if (role.permissions) {
        for (const permission of role.permissions) {
          await newRole
            .related("permissions")
            .attach([permissionNameToId[permission]]);
        }
      }
    }
  }
}
