import router from '@adonisjs/core/services/router'
import ConfigsController from '../../app/configuration/controllers/configs_controller.js'
import { middleware } from '#start/kernel'

router
  .resource('/configuration', ConfigsController)
  // .middleware(
  //   '*',
  //   middleware.auth({
  //     guards: ['api'],
  //   })
  // )
  .apiOnly()
