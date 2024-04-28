import vine from '@vinejs/vine'

export const suggestionValidator = vine.compile(
  vine.object({
		description: vine.string()
  })
)

export const updateSuggestionStatusValidator = vine.compile(
	vine.object({
		status: vine.enum(['pending', 'approved', 'rejected'])
	})
)

