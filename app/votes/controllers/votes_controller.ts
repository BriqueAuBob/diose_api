import type { HttpContext } from '@adonisjs/core/http'

import VoteRepository from '../repositories/vote.js'
import { inject } from '@adonisjs/core'
import { voteValidator } from '#votes/validators/vote'

@inject()
export default class VoteController {
  constructor(private voteRepository: VoteRepository) {}

  async index({ response, request }: HttpContext) {
    const { page, per_page } = request.qs()
    return response.send(await this.voteRepository.paginate(page, per_page))
  }

  async store({ request, response, auth }: HttpContext) {
    const { suggestion_id, vote } = await request.validateUsing(voteValidator)
    const user = auth.user!
    const existingVote = await this.voteRepository.findByUserAndSuggestion(user.id, suggestion_id)

    if (existingVote) await existingVote.delete()

    const newVote = await this.voteRepository.create({
      suggestionId: suggestion_id,
      userId: user.id,
      vote
    })

    return response.created(newVote)
  }
}
