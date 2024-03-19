import { userUpdateValidator } from '#users/validators/user'
import UserRepository from '../repositories/user.js'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

@inject()
export default class AdminUserController {
  constructor(private userRepository: UserRepository) {}

  /**
   * RUD methods
   **/
  async index({ request }: HttpContext) {
    const { page, limit } = request.qs()
    return await this.userRepository.paginate(page, limit)
  }

  async show({ params }: HttpContext) {
    return await this.userRepository.findById(params.user)
  }

  async update({ params, request }: HttpContext) {
    const user = await this.userRepository.findById(params.user)
    user.merge(request.validateUsing(userUpdateValidator))
    await user.save()
    return user
  }

  async destroy({ params, response }: HttpContext) {
    const user = await this.userRepository.findById(params.user)
    await user.delete()
    return response.send({
      message: 'User deleted',
    })
  }

  /**
   * Custom methods
   */
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
