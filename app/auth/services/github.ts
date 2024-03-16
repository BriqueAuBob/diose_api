import ServiceOAuth from '../contracts/ServiceOAuth.js'
import User from '../models/user.js'
import UserRepository from '../repositories/user.js'
import LoggerService from '../../core/services/log.js'

type GitHubAllyUser = {
  id: string
  login: string
  name: string
  email: string
  avatarUrl: string
  original: any
}

export default class GithubAuth implements ServiceOAuth<GitHubAllyUser, User | boolean> {
  constructor(
    private loggerService: LoggerService,
    private userRepository: UserRepository
  ) {}

  public async authorizeUser(user: GitHubAllyUser): Promise<User | boolean> {
    try {
      console.log(user)
      const exists = await this.userRepository.findBySocialId(user.id)
      if (!exists) {
        return await this.userRepository.findOrCreate({
          email: user.email,
          username: user.original.login,
          displayName: user.name,
          avatarUrl: user.avatarUrl,
          socialType: 'github',
          socialId: user.id,
        })
      }
      return exists
    } catch (error) {
      console.error(error)
      this.loggerService.store('error', 'DiscordAuth')
      return false
    }
  }
}
