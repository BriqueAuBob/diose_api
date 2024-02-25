import router from '@adonisjs/core/services/router'
import ConfigsController from '#controllers/configs_controller'

router.resource('/configuration', ConfigsController).apiOnly()
