import VoteRepository from '#suggestions/repositories/vote'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AdminVotesController {
	constructor(private voteRepository: VoteRepository) {}

	public async index() {
		return await this.voteRepository.getAll()
	}

	public async show({ params }: HttpContext) {
		return await this.voteRepository.find(params.id)
	}

	public async destroy({ params, response }: HttpContext) {
		const suggestion = await this.voteRepository.find(params.id)

		await suggestion.delete()
		return response.send({
			message: 'Vote deleted successfully'
		})
	}
}
