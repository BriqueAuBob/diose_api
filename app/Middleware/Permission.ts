import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class Permission {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>,
    allow: string[]
  ) {
    const user = auth.user;
    await auth.user?.load("roles");

    if (!user?.hasPermission(allow[0])) {
      return response.status(403).send({
        errors: [
          {
            message: "Vous n'êtes pas autorisé à effectuer cette action.",
          },
        ],
      });
    }
    await next();
  }
}
