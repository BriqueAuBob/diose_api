import vine from '@vinejs/vine'

export const projectValidator = vine.compile(
  vine.object({
    name: vine.string(),
    description: vine.string().optional(),
    logoUrl: vine.string().optional(),
    coverUrl: vine.string().optional(),
    isVisible: vine.boolean().optional(),
  })
)
