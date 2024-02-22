import type { HttpContext } from '@adonisjs/core/http'

export default class AuthSocialController {
  public async redirectToProvider({ ally, params, response }: HttpContext) {
    return response.send({
      redirect_url: await ally.use(params.provider).redirectUrl(),
    })
  }

  public async handleProviderCallback({ ally, params, response }: HttpContext) {
    const user = await ally.use(params.provider).user()
    return response.send(user)
  }
}
