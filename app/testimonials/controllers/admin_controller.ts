import TestimonialRepository from '#testimonials/repositories/testimonial'
import { updateTestimonialVisibilityValidator } from '#testimonials/validators/testimonial'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AdminTestimonialsController {
  constructor(private testimonialRepository: TestimonialRepository) {}

  public async index() {
    return await this.testimonialRepository.getAll()
  }

  public async show({ params }: HttpContext) {
    return await this.testimonialRepository.find(params.id)
  }

  public async update({ params, request }: HttpContext) {
    const testimonial = await this.testimonialRepository.find(params.id)
    testimonial.merge(await request.validateUsing(updateTestimonialVisibilityValidator))
    await testimonial.save()
    return testimonial
  }

  public async delete({ params, response }: HttpContext) {
    const testimonial = await this.testimonialRepository.find(params.id)
    await testimonial.delete()
    return response.send({
      message: 'Testimonial deleted successfully',
    })
  }
}
