import BaseRepository, { PaginationOptions } from '#repositories/base'
import User from '../models/user.js'
import Social from '#users/models/social'

export default class UserRepository extends BaseRepository<typeof User> {
  protected model = User

  async findOrCreate(data: Partial<User>) {
    return await User.firstOrCreate(
      {
        email: data.email,
        username: data.username,
        socialType: data.socialType,
      },
      data
    )
  }

  async findBySocialId(socialId: string, provider: string) {
    return await User.query()
      .where('social_type', provider)
      .preload('socials')
      .whereHas('socials', (query) => {
        query.where('social_id', socialId)
      })
      .first()
  }

  async findRegisteredByEmail(email: string) {
    return await User.query().where('email', email).andWhereNull('social_type').first()
  }

  async findOrCreateOAuth(data: Partial<User>, social: Partial<Social>) {
    const user = await User.updateOrCreate(
      {
        email: data.email,
        socialType: data.socialType,
      },
      data
    )

    await user.related('socials').updateOrCreate(
      { provider: social.provider, socialId: social.socialId },
      {
        ...social,
        userId: user.id,
      }
    )

    return user
  }

  async search(query: Record<string, any>, options?: PaginationOptions): Promise<any> {
    return (await super.search(query, options)).serialize({
      fields: ['id', 'username', 'avatar_url'],
    })
  }
}
