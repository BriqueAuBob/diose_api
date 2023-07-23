// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Permission from "App/Models/Permission";

export default class PermissionsController {
  async index({ request }) {
    const permissions = await Permission.query()
      .where("display_name", "LIKE", "%" + request.input("search") + "%")
      .orWhere("name", "LIKE", "%" + request.input("search") + "%");

    return {
      success: true,
      permissions: permissions,
    };
  }

  async show({ request }) {
    const permission = await Permission.find(request.param("id"));
    return {
      success: true,
      permission,
    };
  }

  async store({ request }) {
    const permission = new Permission();
    permission.name = request.input("name");
    permission.display_name = request.input("display_name");
    await permission.save();

    return {
      success: true,
      permission,
    };
  }

  async update({ request }) {
    const permission = await Permission.find(request.param("id"));
    if (permission) {
      permission.name = request.input("name");
      permission.display_name = request.input("display_name");
      permission.save();
    } else {
      return {
        success: false,
        message: "Permission introuvable...",
      };
    }
    return {
      success: true,
      permission,
    };
  }

  async destroy({ request }) {
    const permission = await Permission.find(request.param("id"));
    if (permission) {
      await permission.delete();
    } else {
      return {
        success: false,
        message: "Permission introuvable...",
      };
    }
    return {
      success: true,
      message: "Permission supprimé avec succès !",
    };
  }
}
