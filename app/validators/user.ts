import vine from '@vinejs/vine'

export const userRegisterValidator = vine.compile(
  vine.object({
    username: vine.string().minLength(3).maxLength(255),
    email: vine.string().email(),
    password: vine.string().minLength(5).maxLength(255),
    password_confirmation: vine.string().sameAs('password'),
  })
)

export const userLoginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().maxLength(255),
  })
)
