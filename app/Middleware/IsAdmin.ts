import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { AuthenticationException } from "@adonisjs/auth/build/standalone";

export default class IsAdmin {
  public async handle(
    { auth }: HttpContextContract,
    next: () => Promise<void>
  ) {
    const admins = [
      "307531336388968458",
      "364008742637010975",
      "365124713623846913",
      "530357272531042304",
    ];
    if (!auth.user || !admins.includes(auth.user.discord_id)) {
      /**
       * Unable to authenticate using any guard
       */
      throw new AuthenticationException(
        "Vous n'avez pas la permission pour effectuer cette action.",
        "",
        "E_UNAUTHORIZED_ACCESS"
      );
    }
    // code for middleware goes here. ABOVE THE NEXT CALL
    await next();
  }
}
