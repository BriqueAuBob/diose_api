import type { HttpContext } from '@adonisjs/core/http'

export default class UserController {
  public async currentUser({ auth, response }: HttpContext) {
    return response.send({
      user: auth.user,
      status: 200,
    })
  }
}
