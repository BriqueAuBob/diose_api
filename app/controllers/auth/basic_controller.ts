import User from '#models/user'
import UserRepository from '#repositories/user'
import {
  userLoginValidator,
  userRegisterValidator,
  userResetPasswordValidator,
} from '#validators/user'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import LoggerService from '#services/log'
import AuthService from '#services/auth'
import db from '@adonisjs/lucid/services/db'

@inject()
export default class AuthBasicController {
  constructor(
    private userRepository: UserRepository,
    private loggerService: LoggerService,
    private authService: AuthService
  ) {}

  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(userRegisterValidator)
    const user = await this.userRepository.create({
      email: payload.email,
      password: payload.password,
      username: payload.username,
    })
    const token = await User.accessTokens.create(user)

    this.sendLog(
      user,
      'Utilisateur inscrit 🎉',
      'Nouvel utilisateur inscrit via email: ' + user.username
    )

    return response.send({ user, token })
  }

  async login({ request, response }: HttpContext) {
    const payload = await request.validateUsing(userLoginValidator)
    const user = await User.verifyCredentials(payload.email, payload.password)
    const token = await User.accessTokens.create(user)

    this.sendLog(
      user,
      'Utilisateur connecté 🌐',
      'Utilisateur connecté via email: ' + user.username
    )

    return response.send({ user, token })
  }

  async forgotPassword({ request, response }: HttpContext) {
    const email = request.input('email')
    const user = await this.userRepository.findRegisteredByEmail(email)
    if (!user) {
      return response.badRequest({ message: 'Aucun utilisateur trouvé avec cet email.' })
    }
    await this.authService.forgotPassword(user)

    this.sendLog(
      user,
      'Mot de passe oublié 🤔',
      'Demande de réinitialisation de mot de passe pour: ' + user.username
    )

    return response.send({ message: 'Un email de réinitialisation de mot de passe a été envoyé.' })
  }

  async resetPassword({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(userResetPasswordValidator)

    const user = auth.user as User
    user.password = payload.password
    await user.save()

    await db.from('auth_access_tokens').where('tokenable_id', user.id).delete()

    this.sendLog(
      user,
      'Mot de passe réinitialisé 🔒',
      'Mot de passe réinitialisé pour: ' + user.username
    )

    return response.send({ message: 'Mot de passe réinitialisé avec succès.' })
  }

  private async sendLog(user: User, title: string, content: string) {
    this.loggerService.store(
      'info',
      {
        content,
        embeds: [
          {
            title,
            fields: [
              {
                name: 'Utilisateur',
                value: user.username,
                inline: true,
              },
              {
                name: 'Méthode',
                value: 'email',
                inline: true,
              },
            ],
            color: 0x00ff00,
          },
        ],
      },
      { user, configWebhookUrlKey: 'auth' }
    )
  }
}
