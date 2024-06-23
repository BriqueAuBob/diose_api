import router from '@adonisjs/core/services/router'

import AdminUserController from '#users/controllers/admin_controller'
import AdminTestimonialsController from '#testimonials/controllers/admin_controller'
import AdminProjectsController from '#projects/controllers/admin_controller'
import AdminPartnersController from '#partners/controllers/admin_controller'
import AdminNotificationsController from '#notifications/controllers/admin_controller'
import AdminTagsController from '#tags/controllers/admin_controller'
import AdminSuggestionsController from '#suggestions/controllers/admin_suggestions_controller'
import AdminVotesController from '#suggestions/controllers/admin_votes_controller'
import AdminSavesController from '#makebetter/features/saves/controllers/admin_controller'

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
    router.resource('tags', AdminTagsController).apiOnly().as('admin.tags')

    router
      .resource('notifications', AdminNotificationsController)
      .apiOnly()
      .as('admin.notifications')
    router
      .group(() => {
        router.post('mass', [AdminNotificationsController, 'massStore']).as('massStore')
        router.put('mass', [AdminNotificationsController, 'massUpdate']).as('massUpdate')
      })
      .prefix('notifications')
      .as('admin.notifications')
    router
      .group(() => {
        router.get('/', [AdminSuggestionsController, 'index'])
        router.get('/:id', [AdminSuggestionsController, 'show'])
        router.put('/:id', [AdminSuggestionsController, 'update'])
        router.delete('/:id', [AdminSuggestionsController, 'destroy'])
      })
      .prefix('suggestions')
    router
      .group(() => {
        router.get('/', [AdminVotesController, 'index'])
        router.get('/:id', [AdminVotesController, 'show'])
        router.delete('/:id', [AdminVotesController, 'destroy'])
      })
      .prefix('votes')

    router
      .group(() => {
        router.resource('saves', AdminSavesController).apiOnly().except(['store']).as('admin.saves')
      })
      .prefix('makebetter')
  })
  .prefix('admin')
