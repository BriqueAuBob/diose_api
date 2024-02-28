import ServiceOAuth from '#contracts/ServiceOAuth'
import User from '#models/user'
import UserRepository from '#repositories/user'
import LoggerService from '#services/log'

type GoogleUser = {
  sub: string
  email: string
  name: string
  picture: string
}

export default class GoogleAuth implements ServiceOAuth<GoogleUser, User | boolean> {
  constructor(
    private loggerService: LoggerService,
    private userRepository: UserRepository
  ) {}

  public async authorizeUser(user: GoogleUser): Promise<User | boolean> {
    try {
      console.log(user)
      const exists = await this.userRepository.findBySocialId(user.sub)
      if (!exists) {
        return await this.userRepository.findOrCreate({
          email: user.email,
          username: user.name,
          avatarUrl: user.picture,
          socialType: 'google',
          socialId: user.sub,
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
