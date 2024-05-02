import Suggestion from '#suggestions/models/suggestion'
import vine from '@vinejs/vine'

export const voteValidator = vine.compile(
  vine.object({
		params: vine.object({
			id: vine.number().exists((db, value) =>
				db
					.from(Suggestion.table)
					.where('id', value)
					.count('*', 'count')
					.then(([{ count }]) => count > 0)
			),
		}),
		vote: vine.enum(['up', 'down'])
  })
)
