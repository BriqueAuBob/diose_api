import User from '../models/user.js'

export default class UserRepository {
  async create(data: Partial<User>) {
    return await User.create(data)
  }

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

  async findById(id: number) {
    return await User.findOrFail(id)
  }

  async findBySocialId(socialId: string) {
    return await User.findBy('social_id', socialId)
  }

  async findRegisteredByEmail(email: string) {
    return await User.query().where('email', email).andWhereNull('social_type').first()
  }

  async paginate(page: number = 1, limit: number = 10) {
    return await User.query().orderBy('id', 'asc').paginate(page, limit)
  }
}
