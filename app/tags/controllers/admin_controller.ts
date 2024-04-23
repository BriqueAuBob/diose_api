import TagRepository from '#tags/repositories/tag_repository'
import { tagValidator } from '#tags/validators/tag'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AdminTagsController {
  private tagRepository: TagRepository

  constructor(tagRepository: TagRepository) {
    this.tagRepository = tagRepository
  }

  async index() {
    return await this.tagRepository.getAll()
  }

  async show({ params: { id } }: HttpContext) {
    return await this.tagRepository.find(id)
  }

  async store({ request }: HttpContext) {
    return await this.tagRepository.create(await request.validateUsing(tagValidator))
  }

  async update({ params: { id }, request }: HttpContext) {
    const tag = await this.tagRepository.find(id)
    return await this.tagRepository.update(tag, await request.validateUsing(tagValidator))
  }

  async destroy({ params: { id } }: HttpContext) {
    return await this.tagRepository.delete(id)
  }
}
