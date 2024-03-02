import ServiceOAuth from '#contracts/ServiceOAuth'
import User from '#models/user'
import UserRepository from '#repositories/user'
import mail from '@adonisjs/mail/services/main'
import DiscordAuth from './discord/auth.js'
import GithubAuth from './github/auth.js'
import GoogleAuth from './google/auth.js'
import LoggerService from './log.js'
import ResetPasswordNotification from '#mails/reset_password_notification'
import { userResetPasswordValidator } from '#validators/user'

export default class AuthService {
  public async handleOAuth(provider: string): Promise<ServiceOAuth<any, any>> {
    const logger = new LoggerService()
    const userRepository = new UserRepository()

    switch (provider) {
      case 'discord':
        return await new DiscordAuth(logger, userRepository)
      case 'google':
        return await new GoogleAuth(logger, userRepository)
      case 'github':
        return await new GithubAuth(logger, userRepository)
      default:
        throw new Error('Invalid provider')
    }
  }

  public async forgotPassword(user: User) {
    await mail.send(new ResetPasswordNotification(user))
  }
}
