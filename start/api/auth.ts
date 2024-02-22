import router from '@adonisjs/core/services/router'
import AuthSocialController from '#controllers/auth/social_controller'

router.group(() => {}).prefix('auth')

router
  .group(() => {
    router
      .group(() => {
        router.get('/', [AuthSocialController, 'redirectToProvider'])
        router.get('/callback', [AuthSocialController, 'handleProviderCallback'])
      })
      .prefix(':provider')
      .where('provider', /discord/)
  })
  .prefix('oauth')
