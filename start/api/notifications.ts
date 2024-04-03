import router from '@adonisjs/core/services/router'

import NotificationsController from '#notifications/controllers/notifications_controller'

router
  .group(() => {
    router.get('/', [NotificationsController, 'index'])
    router.get('/:notification', [NotificationsController, 'show'])
    router.put('/:notification', [NotificationsController, 'update'])
    router.delete('/:notification', [NotificationsController, 'destroy'])
  })
  .prefix('notifications')
