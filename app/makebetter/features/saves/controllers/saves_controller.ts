import { inject } from '@adonisjs/core'
import SaveRepository from '../repositories/save_repository.js'
import { HttpContext } from '@adonisjs/core/http'
import { createSaveValidator, updateMembersValidator } from '../validators/save.js'
import PaginationService from '#services/pagination'

@inject()
export default class SavesController {
  constructor(
    private saveRepository: SaveRepository,
    private paginationService: PaginationService
  ) {}

  async index({ request, auth }: HttpContext) {
    const { personal } = request.qs()
    const isPersonal = personal && personal === 'true'

    if (isPersonal) {
      await auth.authenticate()
    }

    return await this.paginationService.search(this.saveRepository, {
      isPublic: !isPersonal,
      isVerified: !isPersonal,
      authorId: isPersonal ? auth.user!.id : undefined,
      ...request.qs(),
    })
  }

  async show({ params }: HttpContext) {
    return await this.saveRepository.findById(params.id)
  }

  async store({ request, auth }: HttpContext) {
    const payload = await request.validateUsing(createSaveValidator)
    return await this.saveRepository.create({ ...payload, authorId: auth?.user?.id })
  }

  async update({ request, params }: HttpContext) {
    const payload = await request.validateUsing(createSaveValidator)
    return await this.saveRepository.update(params.id, payload)
  }

  async delete({ params }: HttpContext) {
    return await this.saveRepository.delete(params.id)
  }

  async getMembers({ params }: HttpContext) {
    return await this.saveRepository.getMembers(params.id)
  }

  async updateMembers({ request, params }: HttpContext) {
    const payload = await request.validateUsing(updateMembersValidator)
    return await this.saveRepository.updateMembers(params.id, payload.members)
  }
}
