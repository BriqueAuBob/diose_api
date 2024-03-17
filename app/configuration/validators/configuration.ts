import vine from '@vinejs/vine'

export const configurationValidator = vine.compile(
  vine.object({
    name: vine.string(),
    description: vine.string().optional(),
    value: vine.any(),
    expose: vine.boolean().optional(),
    type: vine.enum(['json', 'string', 'number', 'boolean']).optional(),
  })
)
