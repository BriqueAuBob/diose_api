import router from '@adonisjs/core/services/router'

import AdminUserController from '#users/controllers/admin_controller'
import AdminTestimonialsController from '#testimonials/controllers/admin_controller'
import AdminProjectsController from '#projects/controllers/admin_controller'
import AdminPartnersController from '#partners/controllers/admin_controller'

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

    router.resource('projects', AdminProjectsController).apiOnly().as('admin.projects')
    router.resource('partners', AdminPartnersController).apiOnly().as('admin.partners')
    router
      .resource('testimonials', AdminTestimonialsController)
      .apiOnly()
      .except(['store'])
      .as('admin.testimonials')
  })
  .prefix('admin')
