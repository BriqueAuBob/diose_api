import { Author } from '../../users/services/public_user_serializer.js'
import Vote from '../models/vote.js'

export default class VoteRepository {
	async getAll() {
		return await Vote.all()
	}

	async find(id: number) {
		return await Vote.findOrFail(id)
	}

	async findByUserAndSuggestion(userId: number, suggestionId: number) {
		return await Vote.query().where('user_id', userId).where('suggestion_id', suggestionId).first()
	}

	async create(data: Partial<Vote>) {
		return await Vote.create(data)
	}

	async paginate(page: number = 1, limit: number = 10) {
		return (await Vote.query().preload('suggestion').preload('user').paginate(page, limit)).serialize({
			relations: {
				suggestion: {
					fields: ['id', 'description', 'status', 'author_id', 'created_at', 'updated_at']
				},
				user: {
					fields: Author
				}
			}
		})
	}
}
