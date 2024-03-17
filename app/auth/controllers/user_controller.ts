import User from '#auth/models/user'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class UserController {
  public async getTemporaryToken({ auth, response }: HttpContext) {
    const token = await User.temporaryTokens.create(auth.user!)
    return response.send({
      token,
      status: 200,
    })
  }

  public async getAccessTokenFromTemporaryToken({ auth, response }: HttpContext) {
    const token = await User.accessTokens.create(auth?.user!)

    await db
      .from('auth_access_tokens')
      .where('id', auth.user!.currentAccessToken.identifier as string)
      .delete()

    return response.send({
      token,
      user: auth.user,
      status: 200,
    })
  }

  public async currentUser({ auth, response }: HttpContext) {
    return response.send({
      user: auth.user,
      status: 200,
    })
  }
}
