import router from '@adonisjs/core/services/router'
import SavesController from '#makebetter/features/saves/controllers/saves_controller'
import { middleware } from '#start/kernel'

router
  .resource('makebetter/saves', SavesController)
  .apiOnly()
  .middleware(
    ['store', 'update', 'destroy'],
    middleware.auth({
      guards: ['api'],
    })
  )
