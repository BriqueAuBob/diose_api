import type { HttpContext } from '@adonisjs/core/http'

import TestimonialRepository from '../repositories/testimonial.js'
import { inject } from '@adonisjs/core'
import { testimonialValidator } from '#testimonials/validators/testimonial'

@inject()
export default class TestimonialsController {
  constructor(private testimonialRepository: TestimonialRepository) {}

  async index({ response, request }: HttpContext) {
    const { page, per_page } = request.qs()
    return response.send(await this.testimonialRepository.paginate(page, per_page))
  }

  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(testimonialValidator)
    return response.send(
      await this.testimonialRepository.create({ ...payload, authorId: auth.user!.id })
    )
  }
}
