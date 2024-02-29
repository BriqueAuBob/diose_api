import router from '@adonisjs/core/services/router'
import AuthSocialController from '#controllers/auth/social_controller'
import UserController from '#controllers/user_controller'
import { middleware } from '#start/kernel'
import AuthBasicController from '#controllers/auth/basic_controller'

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
