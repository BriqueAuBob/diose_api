import PaginationService from '#services/pagination'
import UserRepository from '#users/repositories/user'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class UserController {
  constructor(
    private userRepository: UserRepository,
    private paginationService: PaginationService
  ) {}

  public async currentUser({ auth, response }: HttpContext) {
    return response.send({
      user: auth.user,
      status: 200,
    })
  }

  public async index({ request }: HttpContext) {
    return await this.paginationService.search(this.userRepository, {
      ...request.qs(),
    })
  }
}
