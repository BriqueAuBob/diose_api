import ServiceOAuth from '#contracts/ServiceOAuth'
import User from '#models/user'
import UserRepository from '#repositories/user'
import LoggerService from '#services/log'

type DiscordUser = {
  id: string
  username: string
  global_name: string
  email: string
  avatar: string
  discriminator: string
  public_flags: number
  flags: number
  locale: string
  mfa_enabled: boolean
  premium_type: number
  system: boolean
  verified: boolean
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
}

export default class DiscordAuth implements ServiceOAuth<DiscordUser, User | boolean> {
  constructor(
    private loggerService: LoggerService,
    private userRepository: UserRepository
  ) {}

  public async authorizeUser(user: DiscordUser): Promise<User | boolean> {
    try {
      const exists = await this.userRepository.findBySocialId(user.id)
      console.log(user)
      if (!exists) {
        return await this.userRepository.findOrCreate({
          email: user.email,
          username: user.username,
          displayName: user.global_name,
          avatarUrl: user.avatar,
          socialType: 'discord',
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
