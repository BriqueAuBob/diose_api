import type { HttpContext } from '@adonisjs/core/http'

import TestimonialRepository from '../repositories/testimonial.js'
import { inject } from '@adonisjs/core'

@inject()
export default class TestimonialsController {
  constructor(private testimonialRepository: TestimonialRepository) {}

  async index({ response }: HttpContext) {
    return response.send(await this.testimonialRepository.getAll())
  }
}
