import router from '@adonisjs/core/services/router'
import UserController from '../../app/users/controllers/user_controller.js'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.get('/@me', [UserController, 'currentUser']).middleware(
      middleware.auth({
        guards: ['api'],
      })
    )
  })
  .prefix('users')

router.resource('users', UserController).only(['index'])
