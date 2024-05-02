import Suggestion from '../models/suggestion.js'
import { Author } from '../../users/services/public_user_serializer.js'

export default class SuggestionRepository {
	async getAll() {
		return await Suggestion.all()
	}

	async find(id: number) {
		return await Suggestion.findOrFail(id)
	}

	async create(data: Partial<Suggestion>) {
		return await Suggestion.create(data)
	}

	async paginate(page: number = 1, limit: number = 10) {
		return (
			await Suggestion
				.query()
				.preload('author')
				.preload('votes', (votesQuery) => {
					votesQuery.preload('user')
				}).paginate(page, limit)).serialize({
					relations: {
						author: {
							fields: Author
						},
					votes: {
						fields: ['id', 'user_id', 'suggestion_id', 'vote', 'created_at', 'updated_at']
					}
				}
			}
		)
	}
}
