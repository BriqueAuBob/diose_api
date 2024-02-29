import User from '#models/user'
import UserRepository from '#repositories/user'
import { userLoginValidator, userRegisterValidator } from '#validators/user'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import LoggerService from '#services/log'

@inject()
export default class AuthBasicController {
  constructor(
    private userRepository: UserRepository,
    private loggerService: LoggerService
  ) {}

  async register({ request, response }: HttpContext) {
    const payload = await userRegisterValidator.validate(request.all())
    const userExists = await this.userRepository.findRegisteredByEmail(payload.email)
    if (userExists) {
      return response.badRequest({ message: 'Email déjà associé à un compte.' })
    }
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
    const payload = await userLoginValidator.validate(request.all())
    const user = await User.verifyCredentials(payload.email, payload.password)
    const token = await User.accessTokens.create(user)

    this.sendLog(
      user,
      'Utilisateur connecté 🌐',
      'Utilisateur connecté via email: ' + user.username
    )

    return response.send({ user, token })
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
