import BaseRepository from '#repositories/base'
import User from '../models/user.js'

export default class UserRepository extends BaseRepository<typeof User> {
  protected model = User

  async findOrCreate(data: Partial<User>) {
    return await User.firstOrCreate(
      {
        email: data.email,
        username: data.username,
        socialId: data.socialId,
        socialType: data.socialType,
      },
      data
    )
  }

  async findBySocialId(socialId: string) {
    return await User.findBy('social_id', socialId)
  }

  async findRegisteredByEmail(email: string) {
    return await User.query().where('email', email).andWhereNull('social_type').first()
  }
}
