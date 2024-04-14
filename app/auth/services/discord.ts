import ServiceOAuth from '../contracts/oauth.js'
import User from '../../users/models/user.js'
import UserRepository from '../../users/repositories/user.js'
import LoggerService from '../../core/services/log.js'
import { TokenType } from './auth.js'
import { DateTime } from 'luxon'

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
}

type AdonisAllyUser = {
  original: DiscordUser
  token: TokenType
}

export default class DiscordAuth implements ServiceOAuth<AdonisAllyUser, User | boolean> {
  constructor(
    private loggerService: LoggerService,
    private userRepository: UserRepository
  ) {}

  public async authorizeUser(user: AdonisAllyUser): Promise<User | boolean> {
    try {
      return await this.userRepository.findOrCreateOAuth(
        {
          email: user.original.email,
          username: user.original.username,
          displayName: user.original.global_name,
          avatarUrl: user.original.avatar,
          socialType: 'discord',
        },
        {
          provider: 'discord',
          socialId: user.original.id,
          accessToken: user.token.token,
          refreshToken: user.token.refreshToken,
          expiresAt: user.token.expiresAt?.day
            ? user.token.expiresAt
            : DateTime.now().plus({ seconds: user.token.expiresIn }),
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
