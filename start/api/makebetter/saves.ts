import router from '@adonisjs/core/services/router'
import SavesController from '#makebetter/features/saves/controllers/saves_controller'

router
  .group(() => {
    router.get('/', [SavesController, 'index']).as('index')
  })
  .prefix('makebetter/saves')
  .as('makebetter.saves')
