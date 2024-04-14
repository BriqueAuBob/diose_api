import ServiceOAuth from '../contracts/oauth.js'
import User from '../../users/models/user.js'
import UserRepository from '../../users/repositories/user.js'
import LoggerService from '../../core/services/log.js'
import { TokenType } from './auth.js'

type GitHubAllyUser = {
  id: string
  login: string
  name: string
  email: string
  avatarUrl: string
  original: any
}

type AdonisAllyUser = GitHubAllyUser & {
  original: GitHubAllyUser
  token: TokenType
}

export default class GithubAuth implements ServiceOAuth<AdonisAllyUser, User | boolean> {
  constructor(
    private loggerService: LoggerService,
    private userRepository: UserRepository
  ) {}

  public async authorizeUser(user: AdonisAllyUser): Promise<User | boolean> {
    try {
      return await this.userRepository.findOrCreateOAuth(
        {
          email: user.email,
          username: user.original.login,
          displayName: user.name,
          avatarUrl: user.avatarUrl,
          socialType: 'github',
        },
        {
          provider: 'github',
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
