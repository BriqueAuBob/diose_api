import vine from '@vinejs/vine'

const createSaveValidator = vine.compile(
  vine.object({
    name: vine.string(),
    description: vine.string().optional(),
    data: vine.any(),
    type: vine.string(),
    isPublic: vine.boolean(),
    tags: vine.array(vine.number().optional()).optional(),
  })
)

const updateSaveStatusValidator = vine.compile(
  vine.object({
    isPublic: vine.boolean(),
    isVerified: vine.boolean(),
  })
)

export { createSaveValidator, updateSaveStatusValidator }
