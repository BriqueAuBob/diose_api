import Testimonial from "App/Models/Testimonial"
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class TestimonialController {
    async get({ response, request }) {
        const testimonials = await Testimonial.query()
            .if(request.qs().max, (query) => {  
                query.limit(parseInt(request.qs().max))
            })
            .preload('author')
            .orderByRaw('rand()')
            .select('*');
            
        return response.json({testimonials})
    }

    async store({ request, response, auth }) {
        const data = request.only(['message'])

        const newTestimonial = schema.create({
            message: schema.string([
                rules.required(),
                rules.minLength(4),
                rules.maxLength(500)
            ]),
            star: schema.number([
                rules.required(),
            ])
        })

        const validated = await request.validate({ schema: newTestimonial });
        const testimonial = await Testimonial.create({ user_id: auth.user.id, ...validated })
        return response.json({testimonial})
    }
}