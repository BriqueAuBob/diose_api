import { inject } from '@adonisjs/core'
import SaveRepository from '../repositories/save_repository.js'
import { HttpContext } from '@adonisjs/core/http'
import { createSaveValidator } from '../validators/save.js'

@inject()
export default class AdminSavesController {
  constructor(private saveRepository: SaveRepository) {}

  async index({ request }: HttpContext) {
    return await this.saveRepository.search({ isPublic: true }, request.qs())
  }

  async show({ params }: HttpContext) {
    return await this.saveRepository.findById(params.id)
  }

  async update({ request, params }: HttpContext) {
    const payload = await request.validateUsing(createSaveValidator)
    return await this.saveRepository.update(params.id, payload)
  }

  async delete({ params }: HttpContext) {
    return await this.saveRepository.delete(params.id)
  }
}
