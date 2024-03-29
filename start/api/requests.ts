import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import RequestsController from '#requests/controllers/request_controller'
import RequestType from '#requests/enums/types'

router
  .group(() => {
    router.get('/', [RequestsController, 'index'])
    router.get('/:id', [RequestsController, 'show'])
    router.post('/:type', [RequestsController, 'store']).where('type', RequestType.join('|'))
    router.put('/:id', [RequestsController, 'update'])
    router.delete('/:id', [RequestsController, 'destroy'])
  })
  .prefix('requests')
  .middleware(
    middleware.auth({
      guards: ['api'],
    })
  )
