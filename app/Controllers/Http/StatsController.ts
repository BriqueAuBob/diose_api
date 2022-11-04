// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from "App/Models/User";
import Usage from "App/Models/Usage";

export default class StatsController {
  public async get() {
    return {
      success: true,
      members: await User.query().getCount(),
      tools: await Usage.query().getCount(),
    };
  }

  public async store({ auth, request }) {
    const authenticated = await auth.use("api").check();
    const user = authenticated ? auth.user : null;
    const { tool } = request.all();

    await Usage.create({
      // @ts-ignore
      user_id: user?.id,
      tool,
      ip: request.ip(),
    });

    return {
      success: true,
    };
  }

  public async getUsages({ auth }) {
    const usages = await Usage.query()
      .where("user_id", auth.user.id)
      .select("*");
    return {
      success: true,
      usages,
    };
  }

  public async getAdminUsages({ request }) {
    const usages = await Usage.query()
      .orderBy("id", "desc")
      .preload("author")
      .where("tool", "LIKE", "%" + request.input("search") + "%")
      .orWhereHas("author", (query) => {
        query.where("username", "LIKE", "%" + request.input("search") + "%");
      })
      .select("*")
      .paginate(request.input("page"), 20);
    return {
      success: true,
      meta: usages.getMeta(),
      usages: usages.toJSON().data,
    };
  }
}
