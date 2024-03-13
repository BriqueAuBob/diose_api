import router from '@adonisjs/core/services/router'
import ConfigsController from '#controllers/configs_controller'
import { middleware } from '#start/kernel'

router
  .resource('/configuration', ConfigsController)
  .middleware(
    '*',
    middleware.auth({
      guards: ['api'],
    })
  )
  .apiOnly()
