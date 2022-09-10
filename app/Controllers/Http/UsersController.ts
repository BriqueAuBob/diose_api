// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from "App/Models/User";

export default class UsersController {
  async index({ request }) {
    const users = await User.query()
      .where("username", "LIKE", "%" + request.input("search") + "%")
      .orWhere("discord_id", "LIKE", "%" + request.input("search") + "%")
      .paginate(request.input("page"), 10);

    return {
      success: true,
      meta: users.getMeta(),
      users: users.toJSON().data,
    };
  }
}
