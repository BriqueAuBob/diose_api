import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

import AuthService from '../services/auth.js'
import LoggerService from '../../core/services/log.js'
import User from '../../users/models/user.js'

@inject()
export default class AuthSocialController {
  constructor(
    private authService: AuthService,
    private loggerService: LoggerService
  ) {}

  public async redirectToProvider({ ally, params, response }: HttpContext) {
    return response.send({
      redirect_url: await ally.use(params.provider).redirectUrl(),
    })
  }

  public async handleProviderCallback({ ally, params, response }: HttpContext) {
    try {
      const user = await ally.use(params.provider).user()
      const dbUser = await (await this.authService.handleOAuth(params.provider)).authorizeUser(user)

      this.loggerService.store(
        'info',
        {
          content: 'Utilisateur connecté via ' + params.provider + ' : ' + dbUser.username,
          embeds: [
            {
              title: 'Nouvelle connexion 🌐',
              fields: [
                {
                  name: 'Utilisateur',
                  value: dbUser.username,
                  inline: true,
                },
                {
                  name: 'Méthode',
                  value: params.provider,
                  inline: true,
                },
              ],
              color: 0x00ff00,
            },
          ],
        },
        { user: dbUser, configWebhookUrlKey: 'auth' }
      )
      const token = await User.accessTokens.create(dbUser)

      return response.send({
        status: 200,
        message: 'Connexion réussie',
        user: dbUser,
        token: token,
      })
    } catch (error) {
      this.loggerService.store('error', 'AuthSocialController')
      return response.status(400).send({
        status: 400,
        message: 'Erreur lors de la connexion',
      })
    }
  }
}
