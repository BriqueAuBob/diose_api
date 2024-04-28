import type { HttpContext } from '@adonisjs/core/http'

import SuggestionRepository from '../repositories/suggestion.js'
import { inject } from '@adonisjs/core'
import { suggestionValidator } from '#suggestions/validators/suggestion'

@inject()
export default class SuggestionController {
  constructor(private suggestionRepository: SuggestionRepository) {}

  async index({ response, request }: HttpContext) {
    const { page, per_page } = request.qs()
    return response.send(await this.suggestionRepository.paginate(page, per_page))
  }

  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(suggestionValidator)

    return response.send(
      await this.suggestionRepository.create({ ...payload, authorId: auth.user!.id, status: 'pending' })
    )
  }
}
