import router from '@adonisjs/core/services/router'
import AuthSocialController from '../../app/auth/controllers/social_controller.js'
import UserController from '../../app/auth/controllers/user_controller.js'
import { middleware } from '#start/kernel'
import AuthBasicController from '../../app/auth/controllers/basic_controller.js'

router.group(() => {}).prefix('auth')

router
  .group(() => {
    router
      .group(() => {
        router.get('/', [AuthSocialController, 'redirectToProvider'])
        router.post('/callback', [AuthSocialController, 'handleProviderCallback'])
      })
      .prefix(':provider')
      .where('provider', /discord|google|github/)
  })
  .prefix('oauth')

router
  .group(() => {
    router.post('/register', [AuthBasicController, 'register'])
    router.post('/login', [AuthBasicController, 'login'])
    router.post('/forgot-password', [AuthBasicController, 'forgotPassword'])
    router.post('/reset-password/', [AuthBasicController, 'resetPassword']).middleware(
      middleware.auth({
        guards: ['resetPassword'],
      })
    )
  })
  .prefix('auth')

router
  .group(() => {
    router.get('/@me', [UserController, 'currentUser']).middleware(
      middleware.auth({
        guards: ['api'],
      })
    )
  })
  .prefix('users')
