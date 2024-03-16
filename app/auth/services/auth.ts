import ServiceOAuth from '../contracts/oauth.js'
import User from '../models/user.js'
import UserRepository from '../repositories/user.js'
import mail from '@adonisjs/mail/services/main'
import DiscordAuth from './discord.js'
import GithubAuth from './github.js'
import GoogleAuth from './google.js'
import LoggerService from '../../core/services/log.js'
import ResetPasswordNotification from '../mails/reset_password_notification.js'

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
