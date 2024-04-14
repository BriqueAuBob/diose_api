import ServiceOAuth from '../contracts/oauth.js'
import User from '../../users/models/user.js'
import UserRepository from '../../users/repositories/user.js'
import LoggerService from '../../core/services/log.js'
import { TokenType } from './auth.js'

type GoogleUser = {
  id: string
  sub: string
  email: string
  name: string
  picture: string
}

type AdonisAllyUser = GoogleUser & {
  original: GoogleUser
  token: TokenType
}

export default class GoogleAuth implements ServiceOAuth<AdonisAllyUser, User | boolean> {
  constructor(
    private loggerService: LoggerService,
    private userRepository: UserRepository
  ) {}

  public async authorizeUser(user: AdonisAllyUser): Promise<User | boolean> {
    try {
      return await this.userRepository.findOrCreateOAuth(
        {
          email: user.email,
          username: user.name,
          avatarUrl: user.picture,
          socialType: 'google',
        },
        {
          provider: 'google',
          socialId: user.id,
          accessToken: user.token.token,
          refreshToken: user.token.refreshToken,
          expiresAt: user.token.expiresAt,
          tokenType: user.token.tokenType,
        }
      )
    } catch (error) {
      console.error(error)
      this.loggerService.store('error', 'DiscordAuth')
      return false
    }
  }
}
