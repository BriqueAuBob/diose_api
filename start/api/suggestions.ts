import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import SuggestionsController from '#suggestions/controllers/suggestions_controller'
import VoteController from '#suggestions/controllers/votes_controller'

router
  .resource('/suggestions', SuggestionsController)
  .middleware(
    'store',
    middleware.auth({
      guards: ['api']
    })
  )
  .apiOnly()

router
  .post('/suggestions/:id/vote', [VoteController, 'store'])
  .middleware(
    middleware.auth({
      guards: ['api']
    })
  )
