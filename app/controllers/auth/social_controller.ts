import type { HttpContext } from '@adonisjs/core/http'
import LogService from '#services/log'
import { inject } from '@adonisjs/core'
import User from '#models/user'

@inject()
export default class AuthSocialController {
  constructor(private logService: LogService) {}

  public async redirectToProvider({ ally, params, response }: HttpContext) {
    return response.send({
      redirect_url: await ally.use(params.provider).redirectUrl(),
    })
  }

  public async handleProviderCallback({ ally, params, response }: HttpContext) {
    const user = await ally.use(params.provider).user()
    this.logService.store('info', 'User logged in', new User())
    return response.send(user)
  }
}
