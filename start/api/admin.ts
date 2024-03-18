import router from '@adonisjs/core/services/router'

import AdminUserController from '#auth/controllers/admin_controller'
import ProjectsController from '#projects/controllers/projects_controller'

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

    router.resource('projects', ProjectsController).apiOnly()
  })
  .prefix('admin')
