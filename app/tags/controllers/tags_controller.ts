import TagRepository from '#tags/repositories/tag_repository'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class TagsController {
  private tagRepository: TagRepository

  constructor(tagRepository: TagRepository) {
    this.tagRepository = tagRepository
  }

  async index({ request }: HttpContext) {
    const { type, name } = request.qs()
    return await this.tagRepository.search({ type, name })
  }

  async show({ params: { id } }: HttpContext) {
    return await this.tagRepository.find(id)
  }
}
