import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import TestimonialsController from '#testimonials/controllers/testimonials_controller'

router
  .resource('/testimonials', TestimonialsController)
  .middleware(
    'store',
    middleware.auth({
      guards: ['api'],
    })
  )
  .apiOnly()
