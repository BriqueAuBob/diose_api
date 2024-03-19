import { Author } from '../../users/services/public_user_serializer.js'
import Testimonial from '../models/testimonial.js'

export default class TestimonialRepository {
  async getAll() {
    return await Testimonial.all()
  }

  async find(id: number) {
    return await Testimonial.findOrFail(id)
  }

  async create(data: Partial<Testimonial>) {
    return await Testimonial.create(data)
  }

  async paginate(page: number = 1, limit: number = 10) {
    return (await Testimonial.query().preload('author').paginate(page, limit)).serialize({
      relations: {
        author: {
          fields: Author,
        },
      },
    })
  }
}
