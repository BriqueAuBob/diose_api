/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { fsImportAll } from '@adonisjs/core/helpers'
import config from '@adonisjs/core/services/config'
import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    apiVersion: '2.0.0',
    appName: config.get('dynamic.appName'),
  }
})

await fsImportAll(new URL('./api', import.meta.url))
