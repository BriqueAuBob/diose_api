import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import VotesController from '#votes/controllers/votes_controller'

router
  .resource('/votes', VotesController)
  .middleware(
    'store',
    middleware.auth({
      guards: ['api'],
    })
  )
  .apiOnly()
