import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import SuggestionsController from '#suggestions/controllers/suggestions_controller'

router
  .resource('/suggestions', SuggestionsController)
  .middleware(
    'store',
    middleware.auth({
      guards: ['api'],
    })
  )
  .apiOnly()
