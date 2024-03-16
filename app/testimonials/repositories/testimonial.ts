import Testimonial from '../models/testimonial.js'

export default class TestimonialRepository {
  async getAll() {
    return await Testimonial.all()
  }
}
