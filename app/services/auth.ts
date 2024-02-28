import ServiceOAuth from '#contracts/ServiceOAuth'
import UserRepository from '#repositories/user'
import DiscordAuth from './discord/auth.js'
import GithubAuth from './github/auth.js'
import GoogleAuth from './google/auth.js'
import LoggerService from './log.js'

export default class AuthService {
  public sendLog() {
    console.log('Log sent')
  }

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
}
