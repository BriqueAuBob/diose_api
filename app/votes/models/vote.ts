import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import Suggestion from '#suggestions/models/suggestion'
import User from '#users/models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Vote extends BaseModel {
	@column({ isPrimary: true })
	declare id: number

	@column({ serializeAs: null })
	declare suggestionId: number

	@column({ serializeAs: null })
	declare userId: number

	@belongsTo(() => Suggestion, {
		foreignKey: 'suggestionId'
	})
	declare suggestion: BelongsTo<typeof Suggestion>

	@belongsTo(() => User, {
		foreignKey: 'userId'
	})
	declare user: BelongsTo<typeof User>

	@column()
	declare vote: 'up' | 'down'

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime
}
