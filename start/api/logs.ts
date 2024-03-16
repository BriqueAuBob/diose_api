import router from '@adonisjs/core/services/router'

import LogsController from '../../app/core/controllers/logs_controller.js'

router.get('/logs', [LogsController, 'index'])
