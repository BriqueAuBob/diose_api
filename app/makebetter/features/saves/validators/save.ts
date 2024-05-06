import vine from '@vinejs/vine'

const createSaveValidator = vine.compile(
  vine.object({
    name: vine.string(),
    description: vine.string().optional(),
    data: vine.any(),
    type: vine.string(),
    isPublic: vine.boolean(),
    tags: vine.array(vine.number()).optional(),
  })
)

export { createSaveValidator }
