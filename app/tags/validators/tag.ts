import vine from '@vinejs/vine'

const tagValidator = vine.compile(
  vine.object({
    name: vine.string(),
    color: vine.string(),
  })
)

export { tagValidator }
