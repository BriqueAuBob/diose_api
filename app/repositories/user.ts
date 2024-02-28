import User from '#models/user'

export default class UserRepository {
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
}
