import router from '@adonisjs/core/services/router'

import AdminUserController from '#auth/controllers/admin_controller'

router
  .group(() => {
    router
      .group(() => {
        router.get('/', [AdminUserController, 'index'])
        router.get('/:user', [AdminUserController, 'show'])
        router.post('/:user/ban', [AdminUserController, 'ban'])
        router.post('/:user/unban', [AdminUserController, 'unban'])
      })
      .prefix('users')
  })
  .prefix('admin')
