import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import User from '../../users/models/user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Suggestion extends BaseModel {
	@column({ isPrimary: true })
	declare id: number

	@column({ serializeAs: null })
	declare authorId: number

	@belongsTo(() => User, {
		foreignKey: 'authorId'
	})
	declare author: BelongsTo<typeof User>

	@column()
	declare description: string

	@column()
	declare status: 'pending' | 'approved' | 'rejected'

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime
}
