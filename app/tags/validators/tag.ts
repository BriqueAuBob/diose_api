import vine from '@vinejs/vine'

const tagValidator = vine.compile(
  vine.object({
    name: vine.object({
      fr: vine.string(),
      en: vine.string(),
    }),
    color: vine.string(),
    type: vine.string().optional(),
  })
)

export { tagValidator }
