import UserRepository from '#auth/repositories/user'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

@inject()
export default class AdminUserController {
  constructor(private userRepository: UserRepository) {}

  async index({ request }: HttpContext) {
    const { page, limit } = request.qs()
    return await this.userRepository.paginate(page, limit)
  }

  async show({ params }: HttpContext) {
    return await this.userRepository.findById(params.user)
  }

  async ban({ params }: HttpContext) {
    const user = await this.userRepository.findById(params.user)
    user.bannedAt = DateTime.local()
    await user.save()
    return user
  }

  async unban({ params }: HttpContext) {
    const user = await this.userRepository.findById(params.user)
    user.bannedAt = null
    await user.save()
    return user
  }
}
