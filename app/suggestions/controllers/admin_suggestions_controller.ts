import SuggestionRepository from '#suggestions/repositories/suggestion'
import { updateSuggestionStatusValidator } from '#suggestions/validators/suggestion'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AdminSuggestionsController {
	constructor(private suggestionRepository: SuggestionRepository) {}

	public async index({ response, request }: HttpContext) {
		const { page, per_page } = request.qs()

    return response.send(await this.suggestionRepository.paginate(page, per_page))
	}

	public async show({ params }: HttpContext) {
		return await this.suggestionRepository.find(params.id)
	}

	public async update({ params, request }: HttpContext) {
		const suggestion = await this.suggestionRepository.find(params.id)
		const payload = await request.validateUsing(updateSuggestionStatusValidator)

		suggestion.status = payload.status
		await suggestion.save()
		return suggestion
	}

	public async destroy({ params, response }: HttpContext) {
		const suggestion = await this.suggestionRepository.find(params.id)

		await suggestion.delete()
		return response.send({
			message: 'Suggestion deleted successfully'
		})
	}
}
