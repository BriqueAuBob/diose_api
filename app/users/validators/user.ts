import vine from '@vinejs/vine'

export const userRegisterValidator = vine.compile(
  vine.object({
    username: vine
      .string()
      .minLength(3)
      .maxLength(255)
      .unique(async (query, field) => {
        return !(await query
          .from('users')
          .where('username', field)
          .whereNull('social_type')
          .first())
      }),
    email: vine
      .string()
      .email()
      .unique(async (query, field) => {
        return !(await query.from('users').where('email', field).whereNull('social_type').first())
      }),
    password: vine.string().minLength(5).maxLength(255),
    password_confirmation: vine.string().sameAs('password'),
  })
)

export const userLoginValidator = vine.compile(
  vine.object({
    email: vine.string(),
    password: vine.string().maxLength(255),
  })
)

export const userResetPasswordValidator = vine.compile(
  vine.object({
    password: vine.string().minLength(5).maxLength(255),
    password_confirmation: vine.string().sameAs('password'),
  })
)

export const userUpdateValidator = vine.compile(
  vine.object({
    username: vine.string().minLength(3).maxLength(255).optional(),
    email: vine.string().email().optional(),
    display_name: vine.string().minLength(3).maxLength(255).optional(),
    password: vine.string().minLength(5).maxLength(255).optional(),
    password_confirmation: vine.string().sameAs('password').optional(),
  })
)
