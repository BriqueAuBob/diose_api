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

router.get('makebetter/saves/:id/members', [SavesController, 'getMembers']).middleware(
  middleware.auth({
    guards: ['api'],
  })
)

router.put('makebetter/saves/:id/members', [SavesController, 'updateMembers']).middleware(
  middleware.auth({
    guards: ['api'],
  })
)
