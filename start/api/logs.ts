import router from '@adonisjs/core/services/router'

import LogsController from '#controllers/logs_controller'

router.get('/logs', [LogsController, 'index'])
