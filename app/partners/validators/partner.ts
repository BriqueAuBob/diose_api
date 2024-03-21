import vine from '@vinejs/vine'

export const partnerValidator = vine.compile(
  vine.object({
    project_id: vine.number().nullable(),
    name: vine.string(),
    description: vine.string().optional(),
    logo_url: vine.string(),
    website_url: vine.string().nullable(),
    is_visible: vine.boolean().optional(),
    date_start: vine.date().optional(),
    date_end: vine.date().optional(),
  })
)
