import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '../../users/models/user.js'
import Vote from './vote.js'

export default class Suggestion extends BaseModel {
	@column({ isPrimary: true })
	declare id: number

	@column({ serializeAs: null })
	declare authorId: number

	@belongsTo(() => User, {
		foreignKey: 'authorId'
	})
	declare author: BelongsTo<typeof User>

	@hasMany(() => Vote)
	declare votes: HasMany<typeof Vote>

	@column()
	declare description: string

	@column()
	declare status: 'pending' | 'approved' | 'rejected'

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime
}
