import Project from '#projects/models/project'
import vine from '@vinejs/vine'

export const testimonialValidator = vine.compile(
  vine.object({
    project_id: vine.number().exists((db, value) =>
      db
        .from(Project.table)
        .where('id', value)
        .count('*', 'count')
        .then(([{ count }]) => count > 0)
    ),
    content: vine.string(),
    stars: vine.number(),
  })
)

export const updateTestimonialVisibilityValidator = vine.compile(
  vine.object({
    isVisible: vine.boolean(),
  })
)
